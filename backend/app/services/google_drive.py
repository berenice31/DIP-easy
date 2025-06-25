from typing import IO, Optional
from functools import lru_cache

class GoogleDriveService:
    """Service stub pour interagir avec Google Drive.

    En production, il s'appuie sur l'API Google Drive.
    Dans les tests/unitaires, on patche généralement ``upload`` ou ``_get_service``
    pour éviter les appels réseau.
    """

    _service_cache: dict[Optional[str], Optional["Any"]] = {}  # user_id -> service (ou None)

    SETTINGS_CREDENTIALS = "drive_credentials"
    SETTINGS_FOLDER = "drive_root_folder_id"

    def _get_service(self, user_id: str | None = None):
        """Retourne (et met en cache) le client Google Drive v3."""
        if user_id in self._service_cache:
            return self._service_cache[user_id]

        # Lazy import pour éviter le coût lorsque non utilisé (& faciliter les tests unitaires)
        from googleapiclient.discovery import build  # type: ignore
        from google.oauth2 import service_account  # type: ignore
        import json, logging

        from app.db.base import SessionLocal
        from app.crud.crud_setting import setting as crud_setting

        db = SessionLocal()
        try:
            key_credentials = (
                f"{self.SETTINGS_CREDENTIALS}_{user_id}" if user_id else self.SETTINGS_CREDENTIALS
            )
            creds_json = crud_setting.get_value(db, key_credentials)
            if creds_json is None:
                raise RuntimeError("Google Drive credentials not configured (drive_credentials)")

            creds_info = json.loads(creds_json)
            scopes = ["https://www.googleapis.com/auth/drive"]
            creds = service_account.Credentials.from_service_account_info(creds_info, scopes=scopes)

            # 'cache_discovery=False' to avoid writing to disk when running inside some environments
            self._service_cache[user_id] = build("drive", "v3", credentials=creds, cache_discovery=False)
            return self._service_cache[user_id]
        except Exception as e:
            logging.exception("Unable to build Google Drive service: %s", e)
            # Fallback to mocked behaviour to éviter plantage complet
            self._service_cache[user_id] = None
            return None
        finally:
            db.close()

    # ------------------------------------------------------------------
    # API publique
    # ------------------------------------------------------------------

    def upload(
        self,
        file_obj: IO[bytes] | bytes,
        filename: str,
        mime_type: str = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        *,
        parent_id: str | None = None,
    ) -> str:
        """Upload un fichier et retourne son ID Google Drive.

        Si le service n'est pas configuré correctement, renvoie un ID factice
        (permet de continuer en dev sans Drive).
        """
        import io, uuid, logging
        service = self._get_service()
        if service is None:
            return f"mock-{uuid.uuid4()}"

        from googleapiclient.http import MediaIoBaseUpload  # type: ignore

        # Supportes aussi un 'bytes' brut : on le convertit en BytesIO pour obtenir l'API .seek()
        if isinstance(file_obj, (bytes, bytearray)):
            file_obj = io.BytesIO(file_obj)  # type: ignore[arg-type]

        # Assure que l'objet est bien positionné au début s'il possède seek()
        if hasattr(file_obj, "seek"):
            try:
                file_obj.seek(0)
            except Exception:
                pass

        # Détermine le(s) dossier(s) parent(s)
        if parent_id is None:
            # Récupère le dossier racine configuré (optionnel)
            from app.db.base import SessionLocal
            from app.crud.crud_setting import setting as crud_setting

            db = SessionLocal()
            try:
                parent_id = crud_setting.get_value(db, self.SETTINGS_FOLDER)
            finally:
                db.close()

        file_metadata = {"name": filename}
        if parent_id:
            file_metadata["parents"] = [parent_id]

        media = MediaIoBaseUpload(file_obj, mimetype=mime_type, resumable=False)

        try:
            result = (
                service.files()
                .create(body=file_metadata, media_body=media, fields="id")
                .execute()
            )
            file_id = result["id"]

            # Rendre le fichier publiquement lisible pour les vignettes et la preview
            try:
                service.permissions().create(
                    fileId=file_id,
                    body={"type": "anyone", "role": "reader"},
                    fields="id",
                ).execute()
            except Exception:
                # On ignore les erreurs de permission (souvent déjà accordée)
                pass

            return file_id
        except Exception as e:
            logging.exception("Erreur lors de l'upload sur Google Drive: %s", e)
            # Fallback mock
            return f"mock-{uuid.uuid4()}"

    def delete(self, file_id: str) -> None:
        """Supprime un fichier depuis Google Drive (silencieusement si Drive non configuré)."""
        import logging
        service = self._get_service()
        if service is None:
            return  # Drive non configuré
        try:
            service.files().delete(fileId=file_id).execute()
        except Exception as e:
            logging.warning("Erreur suppression fichier Drive %s: %s", file_id, e)

    def download(self, file_id: str) -> bytes:
        """Télécharge un fichier Drive.

        Renvoie un tableau d'octets vide si Drive non configuré ou erreur.
        """
        import io, logging
        service = self._get_service()
        if service is None:
            return b""
        from googleapiclient.http import MediaIoBaseDownload  # type: ignore
        fh = io.BytesIO()
        try:
            request = service.files().get_media(fileId=file_id)
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            while done is False:
                _status, done = downloader.next_chunk()
            return fh.getvalue()
        except Exception as e:
            logging.warning("Erreur téléchargement fichier Drive %s: %s", file_id, e)
            return b""

    # ------------------------------------------------------------------
    # Folder helpers
    # ------------------------------------------------------------------

    def ensure_folder(self, path: list[str]) -> str:
        """Vérifie l'existence (ou crée) une hiérarchie de dossiers et
        renvoie l'ID du dernier dossier de la liste `path`.

        Si le service Drive n'est pas configuré, renvoie un ID factice basé
        sur le chemin pour permettre l'enchaînement des appels sans erreur.
        """
        import uuid, logging

        if not path:
            raise ValueError("Path must contain at least one segment")

        service = self._get_service()
        if service is None:
            # Fallback mock – concat path pour rester unique entre appels
            return f"mock-{ '/'.join(path) }-{uuid.uuid4()}"

        # Récupère le dossier racine configuré (optionnel)
        from app.db.base import SessionLocal
        from app.crud.crud_setting import setting as crud_setting

        db = SessionLocal()
        try:
            parent_id = crud_setting.get_value(db, self.SETTINGS_FOLDER)
        finally:
            db.close()

        # Fonction interne pour trouver un sous-dossier par nom
        def _find_child_folder(p_id: str | None, name: str) -> str | None:
            # Échappe les apostrophes pour la requête Drive
            escaped_name = name.replace("'", "\\'")
            parent_filter = f" and '{p_id}' in parents" if p_id else " and 'root' in parents"
            query_str = (
                "mimeType='application/vnd.google-apps.folder' "
                "and trashed=false "
                f"and name='{escaped_name}'" + parent_filter
            )

            query = (
                service.files()
                .list(
                    q=query_str,
                    spaces="drive",
                    fields="files(id, name)",
                )
                .execute()
            )
            files = query.get("files", [])
            return files[0]["id"] if files else None

        # Boucle sur chaque segment
        for segment in path:
            # Cherche l'existence dans le parent courant
            existing_id = _find_child_folder(parent_id, segment)
            if existing_id:
                parent_id = existing_id
                continue
            # Sinon, crée le dossier
            folder_metadata = {
                "name": segment,
                "mimeType": "application/vnd.google-apps.folder",
            }
            if parent_id:
                folder_metadata["parents"] = [parent_id]
            new_folder = service.files().create(body=folder_metadata, fields="id").execute()
            parent_id = new_folder["id"]
        return parent_id

    # ------------------------------------------------------------------
    # Conversion helpers
    # ------------------------------------------------------------------

    def convert_to_pdf(self, file_id: str) -> bytes:
        """Convertit un fichier existant sur Drive en PDF et renvoie les octets.

        • Si l'API Drive est inactive ou la conversion échoue, on retourne la
          version téléchargée brute afin d'éviter une erreur HTTP 500.
        """
        import logging

        service = self._get_service()
        if service is None:            # Drive non configuré : tentative de conversion locale avec docx2pdf
            try:
                import tempfile, io, os
                from docx2pdf import convert  # type: ignore
                from app.utils.docx_links import strip_hyperlinks

                # Récupère le docx
                docx_bytes = self.download(file_id)
                with tempfile.TemporaryDirectory() as tmpdir:
                    docx_path = os.path.join(tmpdir, "input.docx")
                    pdf_path = os.path.join(tmpdir, "output.pdf")

                    clean_bytes = strip_hyperlinks(docx_bytes)
                    with open(docx_path, "wb") as f:
                        f.write(clean_bytes)

                    # Lancement de la conversion (Word/LibreOffice requis)
                    convert(docx_path, pdf_path)

                    if os.path.exists(pdf_path):
                        with open(pdf_path, "rb") as f:
                            return f.read()
            except Exception as e:
                logging.warning("Conversion locale docx2pdf impossible: %s", e)

            # En dernier recours, on renvoie le docx (l'appelant décidera)
            return self.download(file_id)

        try:
            # Tentative d'export direct (fonctionne pour les fichiers Docs/Sheets).
            pdf_bytes = (
                service.files()
                .export(fileId=file_id, mimeType="application/pdf")
                .execute()
            )
            if pdf_bytes:
                return pdf_bytes
        except Exception as e:
            logging.warning("Export PDF direct impossible: %s", e)

        # Fallback : on tente de copier + convertir (Drive crée un Google Doc)
        try:
            copy = (
                service.files()
                .copy(body={"mimeType": "application/vnd.google-apps.document"}, fileId=file_id, fields="id")
                .execute()
            )
            tmp_id = copy["id"]
            pdf_bytes = (
                service.files()
                .export(fileId=tmp_id, mimeType="application/pdf")
                .execute()
            )
            # Nettoyage copie
            try:
                service.files().delete(fileId=tmp_id).execute()
            except Exception:
                pass
            return pdf_bytes
        except Exception as e:
            logging.warning("Conversion Drive -> PDF fallback échouée: %s", e)
            # En dernier recours, renvoie le docx brut
            return self.download(file_id)

    # ------------------------------------------------------------------
    # Helpers publics
    # ------------------------------------------------------------------

    def get_thumbnail_url(self, file_id: str) -> str:
        """Construit (ou récupère) l'URL miniature/preview pour un fichier."""
        service = self._get_service()
        if service is None:
            return f"https://drive.google.com/thumbnail?id={file_id}"

        try:
            meta = (
                service.files()
                .get(fileId=file_id, fields="thumbnailLink, webViewLink")
                .execute()
            )
            return meta.get("thumbnailLink") or meta.get("webViewLink") or f"https://drive.google.com/thumbnail?id={file_id}"
        except Exception:
            return f"https://drive.google.com/thumbnail?id={file_id}"


google_drive_service = GoogleDriveService() 