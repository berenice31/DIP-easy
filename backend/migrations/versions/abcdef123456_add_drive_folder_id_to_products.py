from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'abcdef123456'
down_revision = '75c9c1e2b7a3'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('products', sa.Column('drive_folder_id', sa.String(), nullable=True))


def downgrade():
    op.drop_column('products', 'drive_folder_id') 