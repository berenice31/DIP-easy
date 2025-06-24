from typing import Dict

class DocxService:
    """Stub de génération .docx à partir d'un modèle.
    On remplacera par docxtpl ultérieurement."""

    def render(self, template_bytes: bytes, context: Dict) -> bytes:
        """Rend un .docx en utilisant docxtpl.

        Le *template_bytes* doit contenir le fichier modèle Word (.docx).
        Le *context* suit la syntaxe Jinja utilisée par docxtpl.
        """
        try:
            from docxtpl import DocxTemplate, RichText  # type: ignore
            from docx.opc.constants import RELATIONSHIP_TYPE as RT  # type: ignore
            import io

            buf = io.BytesIO(template_bytes)
            doc = DocxTemplate(buf)

            def _hlink(url: str, text: str | None = None):
                """Fonction utilitaire Jinja pour insérer un hyperlien cliquable.

                Utilisation dans les templates : ``{{ hlink(url, 'Voir') }}``
                Source : https://docxtpl.readthedocs.io/en/latest/#adding-a-hyperlink
                """
                from docx.oxml import OxmlElement  # type: ignore
                if not text:
                    text = url

                part = doc.part  # type: ignore
                r_id = part.relate_to(url, RT.HYPERLINK, is_external=True)  # type: ignore

                rt = RichText()
                # Style facultatif : bleu souligné comme les liens Word par défaut
                rt.add(text, url_id=r_id, color="0000EE", underline=True)
                return rt

            flat_ctx = {**context.get("product", {}), **context, "hlink": _hlink}
            doc.render(flat_ctx)

            out_buf = io.BytesIO()
            doc.save(out_buf)

            from app.utils.docx_links import make_links_clickable

            clickable_bytes = make_links_clickable(out_buf.getvalue())
            return clickable_bytes
        except Exception:
            # En cas d'erreur, on renvoie le template original pour ne pas bloquer
            return template_bytes

docx_service = DocxService() 