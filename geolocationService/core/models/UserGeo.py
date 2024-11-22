from datetime import datetime

from sqlalchemy import DECIMAL, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column

from core.models import Base


class UserGeo(Base):
    __tablename__ = "UsersGeo"
    user_id: Mapped[int] = mapped_column(Integer)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    latitude: Mapped[float] = mapped_column(DECIMAL(17, 14))
    longitude: Mapped[float] = mapped_column(DECIMAL(17, 14))
