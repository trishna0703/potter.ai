from app.database import Base

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, UniqueConstraint, ForeignKey


class Shelf(Base):
    __tablename__ = "shelves"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    shelf_type: Mapped[str] = mapped_column(String(20), nullable=False)

    user: Mapped["User"] = relationship(back_populates="shelves")

    plants: Mapped[list["Plant"]] = relationship(
        secondary="shelf_plants", back_populates="shelves"
    )

    __table_args__ = (UniqueConstraint("user_id", "name", name="uq_user_shelf_name"),)
