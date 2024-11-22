from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import String, Integer
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .conversation_user_association import conversation_user_association_table

if TYPE_CHECKING:
    from .Message import Message
    from .User import User


class Conversation(Base):
    __tablename__ = "Conversations"

    last_message_date: Mapped[datetime] = mapped_column(nullable=True)
    last_message_text: Mapped[str] = mapped_column(String, nullable=True)

    messages: Mapped[list["Message"]] = relationship(back_populates="conversation")
    users: Mapped[list["User"]] = relationship(
        secondary=conversation_user_association_table,
        back_populates="conversations",
    )
