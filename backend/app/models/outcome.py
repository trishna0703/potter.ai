from sqlalchemy import Integer, String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

from datetime import date


class Outcome(Base):
    __tablename__ = "outcomes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    concern_id: Mapped[int] = mapped_column(
        ForeignKey("health_concerns.id"), nullable=False
    )

    outcome_type: Mapped[str] = mapped_column(String(100), nullable=False)

    description: Mapped[str | None] = mapped_column(String(2000), nullable=True)

    recorded_on: Mapped[date] = mapped_column(
        Date, default=date.today, nullable=False
    )

    concern: Mapped["HealthConcern"] = relationship(
        back_populates="outcomes", foreign_keys=[concern_id]
    )
