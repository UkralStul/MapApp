from sqlalchemy import Table, Column, ForeignKey, Integer, UniqueConstraint
from .base import Base

conversation_user_association_table = Table(
    "conversation_user_association",
    Base.metadata,
    Column("id", Integer, primary_key=True),
    Column("users", ForeignKey("Users.id"), nullable=False),
    Column("conversations", ForeignKey("Conversations.id"), nullable=False),
    UniqueConstraint("users", "conversations", name="inx_unique_user_conversation"),
)
