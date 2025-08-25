"""Remove password column from users

Revision ID: b5c9a1e2d3f4
Revises: 7a39df486e93
Create Date: 2025-08-25 13:11:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'b5c9a1e2d3f4'
down_revision = '7a39df486e93'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Drop the password column if it exists
    with op.batch_alter_table('users') as batch_op:
        try:
            batch_op.drop_column('password')
        except Exception:
            # Column may already be removed in some environments
            pass


def downgrade() -> None:
    # Recreate the password column as nullable String(255)
    with op.batch_alter_table('users') as batch_op:
        batch_op.add_column(sa.Column('password', sa.String(length=255), nullable=True))
