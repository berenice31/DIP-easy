"""add user_id FK column to products

Revision ID: 75c9c1e2b7a3
Revises: 3b1e4b8e4c12
Create Date: 2025-06-19 15:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '75c9c1e2b7a3'
down_revision: Union[str, None] = '3b1e4b8e4c12'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Ajoute la colonne user_id (UUID) avec clé étrangère vers users.id.
    op.add_column(
        'products',
        sa.Column(
            'user_id',
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey('users.id', ondelete='CASCADE'),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column('products', 'user_id') 