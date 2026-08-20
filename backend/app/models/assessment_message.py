from app.database import Base
from sqlalchemy import Integer, String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date


class AssessmentMessage(Base):

    __tablename__ = "assessment_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    assessment_id: Mapped[int] = mapped_column(
        ForeignKey("assessments.id"), nullable=False
    )

    role: Mapped[str] = mapped_column(String(20), nullable=False)

    message: Mapped[str] = mapped_column(String(2000), nullable=False)

    created_at: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)

    assessment: Mapped["Assessment"] = relationship(back_populates="messages")
