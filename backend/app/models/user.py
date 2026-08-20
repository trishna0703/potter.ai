from datetime import date

from sqlalchemy import Date, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    name: Mapped[str] = mapped_column(String(100), nullable=False)

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)

    joined_on: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)

    planting_experience: Mapped[str | None] = mapped_column(String(20))

    avatar: Mapped[str | None] = mapped_column(String(500))

    google_sub: Mapped[str | None] = mapped_column(
        String(255), unique=True, nullable=True
    )

    shelves: Mapped[list["Shelf"]] = relationship(back_populates="user")

    plants: Mapped[list["Plant"]] = relationship(back_populates="user")

    concerns: Mapped[list["HealthConcern"]] = relationship(back_populates="user")

    photos: Mapped[list["PlantPhoto"]] = relationship(back_populates="user")

    sessions: Mapped[list["UserSession"]] = relationship(back_populates="user")

    evidences: Mapped[list["Evidence"]] = relationship(back_populates="user")
