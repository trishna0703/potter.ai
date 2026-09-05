"""altered schedules

Revision ID: f14561b80281
Revises: 88a6115def92
Create Date: 2026-09-05 10:16:08.177314

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f14561b80281'
down_revision: Union[str, Sequence[str], None] = '88a6115def92'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.execute("""
        UPDATE care_schedules
        SET auto_schedule = false
        WHERE auto_schedule IS NULL
    """)

    op.alter_column(
        "care_schedules", "auto_schedule", existing_type=sa.BOOLEAN(), nullable=False
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.alter_column(
        "care_schedules", "auto_schedule", existing_type=sa.BOOLEAN(), nullable=True
    )
