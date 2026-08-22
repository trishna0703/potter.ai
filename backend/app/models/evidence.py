from datetime import datetime

from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Evidence(Base):
    __tablename__ = "evidences"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    evidence_type: Mapped[str] = mapped_column(String(40), nullable=False)

    evidence_value: Mapped[str] = mapped_column(String(500), nullable=False)

    value_type: Mapped[str] = mapped_column(String(50), nullable=False)

    recorded_on: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.today, nullable=False
    )

    photos: Mapped[list["PlantPhoto"]] = relationship(
        secondary="evidence_photos",
        back_populates="evidences",
    )

    concerns: Mapped[list["HealthConcern"]] = relationship(
        secondary="concern_evidences", back_populates="evidences"
    )

    assessments: Mapped[list["Assessment"]] = relationship(
        secondary="assessment_evidences", back_populates="evidences"
    )

    user: Mapped["User"] = relationship(back_populates="evidences")

    identification: Mapped["PlantIdentification"] = relationship(
        back_populates="evidence"
    )
