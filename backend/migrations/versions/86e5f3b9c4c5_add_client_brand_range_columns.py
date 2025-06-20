"""add nom_client, marque, gamme columns to products

Revision ID: 86e5f3b9c4c5
Revises: 75c9c1e2b7a3
Create Date: 2025-06-19 15:20:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '86e5f3b9c4c5'
down_revision: Union[str, None] = '75c9c1e2b7a3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('products', sa.Column('nom_client', sa.String(), nullable=True))
    op.add_column('products', sa.Column('marque', sa.String(), nullable=True))
    op.add_column('products', sa.Column('gamme', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('products', 'gamme')
    op.drop_column('products', 'marque')
    op.drop_column('products', 'nom_client') 