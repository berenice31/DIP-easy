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
            from docxtpl import DocxTemplate  # type: ignore
            import io

            buf = io.BytesIO(template_bytes)
            doc = DocxTemplate(buf)
            # Permet à la fois {{ product.nom_commercial }} et {{ nom_commercial }}
            flat_ctx = {**context.get("product", {}), **context}
            doc.render(flat_ctx)

            out = io.BytesIO()
            doc.save(out)
            return out.getvalue()
        except Exception:
            # En cas d'erreur, on renvoie le template original pour ne pas bloquer
            return template_bytes

docx_service = DocxService() 