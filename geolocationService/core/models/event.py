from datetime import datetime
from typing import Optional

from sqlalchemy import DECIMAL, JSON, Integer, String, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class Event(Base):
    __tablename__ = "events"

    name: Mapped[str]
    description: Mapped[str] = mapped_column(Text)
    latitude: Mapped[float] = mapped_column(DECIMAL(17, 14))
    longitude: Mapped[float] = mapped_column(DECIMAL(17, 14))
    preview_picture: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    participants: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_by: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
