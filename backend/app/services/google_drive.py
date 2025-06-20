from typing import IO

class GoogleDriveService:
    """Service stub pour interagir avec Google Drive.

    En production, il s'appuiera sur l'API Google Drive.
    Dans les tests, on patchera les méthodes pour éviter les appels externes.
    """

    def upload(self, file_obj: IO[bytes], filename: str) -> str:
        """Upload un fichier et retourne l'ID du fichier Drive."""
        # TODO: Implémentation réelle. Ici on renvoie un ID factice.
        return "drive-file-id-placeholder"

    def delete(self, file_id: str) -> None:
        """Supprime un fichier de Drive."""
        pass

    def download(self, file_id: str) -> bytes:
        """Télécharge un fichier depuis Drive et renvoie son contenu binaire."""
        return b""


google_drive_service = GoogleDriveService() 