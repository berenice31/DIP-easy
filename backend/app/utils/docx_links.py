import io
import zipfile
import xml.etree.ElementTree as ET
from typing import List
import re
from docx import Document  # type: ignore
from docx.oxml import OxmlElement  # type: ignore
from docx.oxml.ns import qn  # type: ignore
from docx.opc.constants import RELATIONSHIP_TYPE as RT  # type: ignore

NAMESPACES = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

ET.register_namespace("w", NAMESPACES["w"])
ET.register_namespace("r", NAMESPACES["r"])

URL_RX = re.compile(r"https?://\S+", re.I)

def strip_hyperlinks(docx_bytes: bytes) -> bytes:
    """Retire les balises <w:hyperlink> pour que les liens n'apparaissent plus.

    1. Décompresse le fichier docx (zip)
    2. Modifie document.xml et document.xml.rels
    3. Rezippe et renvoie les octets modifiés
    """
    in_mem = io.BytesIO(docx_bytes)
    out_mem = io.BytesIO()

    with zipfile.ZipFile(in_mem) as zin:
        with zipfile.ZipFile(out_mem, "w", compression=zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                data = zin.read(item.filename)
                if item.filename == "word/document.xml":
                    data = _remove_hyperlink_elements(data)
                elif item.filename == "word/_rels/document.xml.rels":
                    data = _remove_hyperlink_rels(data)
                zout.writestr(item, data)
    return out_mem.getvalue()


def _remove_hyperlink_elements(xml_data: bytes) -> bytes:
    tree = ET.fromstring(xml_data)
    for hlink in list(tree.findall(".//w:hyperlink", NAMESPACES)):
        parent = None
        # ET fallback to find parent
        for p in tree.iter():
            if hlink in list(p):
                parent = p
                break
        if parent is not None:
            parent.remove(hlink)  # supprime entièrement le lien + son texte
    return ET.tostring(tree, encoding="utf-8")


def _remove_hyperlink_rels(xml_data: bytes) -> bytes:
    tree = ET.fromstring(xml_data)
    to_remove: List[ET.Element] = []
    for rel in tree.findall(".//{http://schemas.openxmlformats.org/package/2006/relationships}Relationship"):
        if rel.get("Type", "").endswith("/relationships/hyperlink"):
            to_remove.append(rel)
    for rel in to_remove:
        tree.remove(rel)
    return ET.tostring(tree, encoding="utf-8")

# ---------------------------------------------------------------------
# Ajout de liens cliquables post-rendu
# ---------------------------------------------------------------------

def make_links_clickable(docx_bytes: bytes) -> bytes:
    """Parcourt le document et convertit les URL texte en hyperliens."""
    doc = Document(io.BytesIO(docx_bytes))

    for paragraph in doc.paragraphs:
        for run in paragraph.runs:
            match = URL_RX.search(run.text or "")
            if match:
                url = match.group(0)
                full_text = run.text
                # On remplace entièrement le run par l'hyperlien
                run.clear()

                part = doc.part  # type: ignore
                r_id = part.relate_to(url, RT.HYPERLINK, is_external=True)

                hyperlink = OxmlElement("w:hyperlink")
                hyperlink.set(qn("r:id"), r_id)

                new_run = OxmlElement("w:r")
                text_elem = OxmlElement("w:t")
                text_elem.text = full_text
                new_run.append(text_elem)
                hyperlink.append(new_run)

                paragraph._p.append(hyperlink)

    out = io.BytesIO()
    doc.save(out)
    return out.getvalue() 