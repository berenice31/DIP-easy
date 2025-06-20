"""add nom_produit, format, version columns

Revision ID: 9c0b7c2e1f34
Revises: 86e5f3b9c4c5
Create Date: 2025-06-19 16:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '9c0b7c2e1f34'
down_revision: Union[str, None] = '86e5f3b9c4c5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('products', sa.Column('nom_produit', sa.String(), nullable=True))
    op.add_column('products', sa.Column('format', sa.String(), nullable=True))
    op.add_column('products', sa.Column('version', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('products', 'version')
    op.drop_column('products', 'format')
    op.drop_column('products', 'nom_produit') 