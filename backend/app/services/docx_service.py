from typing import Dict

class DocxService:
    """Stub de génération .docx à partir d'un modèle.
    On remplacera par docxtpl ultérieurement."""

    def render(self, template_bytes: bytes, context: Dict) -> bytes:
        # Retourne le modèle tel quel pour l'instant (pas de rendu)
        return template_bytes

docx_service = DocxService() 