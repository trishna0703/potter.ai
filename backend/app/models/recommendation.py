from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

from datetime import datetime

class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    concern_id: Mapped[int] = mapped_column(
        ForeignKey("health_concerns.id"), nullable=False
    )

    recommendation_type: Mapped[str] = mapped_column(String(100), nullable=False)

    description: Mapped[str] = mapped_column(String(2000), nullable=False)

    performed_on: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    concern: Mapped["HealthConcern"] = relationship(back_populates="recommendations", foreign_keys=[concern_id])
