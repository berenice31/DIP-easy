"""add progression column

Revision ID: a1b2c3d4e5f6
Revises: 9c0b7c2e1f34
Create Date: 2025-06-19 16:20:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '9c0b7c2e1f34'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('products', sa.Column('progression', sa.Integer(), nullable=False, server_default='0'))


def downgrade() -> None:
    op.drop_column('products', 'progression') 