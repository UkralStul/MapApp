from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from .base import Base
from .conversation_user_association import conversation_user_association_table

if TYPE_CHECKING:
    from .User import User
    from .Conversation import Conversation


class Message(Base):
    __tablename__ = "Messages"

    sender_id: Mapped[int] = mapped_column(ForeignKey("Users.id"), nullable=False)
    conversation_id: Mapped[int] = mapped_column(
        ForeignKey("Conversations.id"), nullable=False
    )
    content: Mapped[str] = mapped_column(String, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        default=datetime.now,
        server_default=func.now(),
    )

    # Связи
    sender: Mapped["User"] = relationship(back_populates="sent_messages")
    conversation: Mapped["Conversation"] = relationship(back_populates="messages")
