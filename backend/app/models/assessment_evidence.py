from app.database import Base

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, PrimaryKeyConstraint


class AssessmentEvidence(Base):
    __tablename__ = "assessment_evidences"

    assessment_id: Mapped[int] = mapped_column(
        ForeignKey("assessments.id"), nullable=False
    )

    evidence_id: Mapped[int] = mapped_column(ForeignKey("evidences.id"), nullable=False)

    __table_args__ = (PrimaryKeyConstraint("assessment_id", "evidence_id"),)
