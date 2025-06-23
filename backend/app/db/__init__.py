from sqlalchemy import text
from .base import engine

def ensure_alias_column():
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE IF EXISTS attachments ADD COLUMN IF NOT EXISTS alias VARCHAR")) 