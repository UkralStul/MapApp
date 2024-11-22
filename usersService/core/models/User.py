from typing import TYPE_CHECKING
from sqlalchemy import String
from sqlalchemy.orm import mapped_column, Mapped, relationship

from .base import Base
from .conversation_user_association import conversation_user_association_table

if TYPE_CHECKING:
    from .Message import Message
    from .Conversation import Conversation


class User(Base):
    __tablename__ = "Users"

    username: Mapped[str] = mapped_column(String)
    hashed_password: Mapped[str] = mapped_column(String)
    email: Mapped[str] = mapped_column(String)
    profile_photo: Mapped[str] = mapped_column(String, nullable=True)

    sent_messages: Mapped[list["Message"]] = relationship(back_populates="sender")
    conversations: Mapped[list["Conversation"]] = relationship(
        secondary=conversation_user_association_table,
        back_populates="users",
    )
