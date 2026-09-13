from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SpeciesCareKnowledge(Base):
    __tablename__ = "species_care_knowledge"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    species: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    care_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    knowledge: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        Index(
            "uq_species_care_knowledge_species_type",
            "species",
            "care_type",
            unique=True,
        ),
    )
