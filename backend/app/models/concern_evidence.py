from app.database import Base

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, PrimaryKeyConstraint


class ConcernEvidence(Base):
    __tablename__ = "concern_evidences"

    concern_id: Mapped[int] = mapped_column(
        ForeignKey("health_concerns.id"), nullable=False
    )

    evidence_id: Mapped[int] = mapped_column(ForeignKey("evidences.id"), nullable=False)

    __table_args__ = (PrimaryKeyConstraint("concern_id", "evidence_id"),)
