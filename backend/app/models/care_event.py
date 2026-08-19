from sqlalchemy import Integer, String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

from datetime import date


class CareEvent(Base):
    __tablename__ = "care_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    plant_id: Mapped[int] = mapped_column(ForeignKey("plants.id"), nullable=False)

    care_type: Mapped[str] = mapped_column(String(100), nullable=False)

    description: Mapped[str | None] = mapped_column(String(2000), nullable=True)

    occurred_on: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)

    plant: Mapped["Plant"] = relationship(back_populates="events")
