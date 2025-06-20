"""add status column and allow nullables

Revision ID: 3b1e4b8e4c12
Revises: 21ddbb72e66e
Create Date: 2025-06-19 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '3b1e4b8e4c12'
down_revision = '21ddbb72e66e'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add enum type
    product_status = postgresql.ENUM('DRAFT', 'VALIDATED', name='product_status')
    product_status.create(op.get_bind(), checkfirst=True)

    # Add column with default DRAFT
    op.add_column('products', sa.Column('status', sa.Enum('DRAFT', 'VALIDATED', name='product_status'), nullable=False, server_default='DRAFT'))

    # Alter nullable columns
    with op.batch_alter_table('products') as batch_op:
        batch_op.alter_column('date_mise_marche', nullable=True)
        batch_op.alter_column('resp_mise_marche', nullable=True)
        batch_op.alter_column('faconnerie', nullable=True)
        batch_op.alter_column('nom_commercial', nullable=True)
        batch_op.alter_column('fournisseur', nullable=True)
        batch_op.alter_column('ref_formule', nullable=True)


def downgrade() -> None:
    with op.batch_alter_table('products') as batch_op:
        batch_op.alter_column('date_mise_marche', nullable=False)
        batch_op.alter_column('resp_mise_marche', nullable=False)
        batch_op.alter_column('faconnerie', nullable=False)
        batch_op.alter_column('nom_commercial', nullable=False)
        batch_op.alter_column('fournisseur', nullable=False)
        batch_op.alter_column('ref_formule', nullable=False)
        batch_op.drop_column('status')

    product_status = postgresql.ENUM('DRAFT', 'VALIDATED', name='product_status')
    product_status.drop(op.get_bind(), checkfirst=True) 