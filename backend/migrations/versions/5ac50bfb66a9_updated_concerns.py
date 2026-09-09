"""updated concerns

Revision ID: 5ac50bfb66a9
Revises: f14561b80281
Create Date: 2026-09-08 17:59:00.064982

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5ac50bfb66a9'
down_revision: Union[str, Sequence[str], None] = 'f14561b80281'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None
def upgrade() -> None:
    """Upgrade schema."""

    # 1. Add column as nullable
    op.add_column(
        "health_concerns",
        sa.Column("title", sa.String(length=30), nullable=True),
    )

    # 2. Populate existing rows
    op.execute("""
        UPDATE health_concerns
        SET title = 'Untitled Concern'
        WHERE title IS NULL
        """)

    # 3. Make column non-nullable
    op.alter_column(
        "health_concerns",
        "title",
        existing_type=sa.String(length=30),
        nullable=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column("health_concerns", "title")
