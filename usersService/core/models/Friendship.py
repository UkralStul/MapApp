from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from .base import Base


class Friendship(Base):
    __tablename__ = "Friendships"

    user_id: Mapped[int] = mapped_column(ForeignKey("Users.id"))
    friend_id: Mapped[int] = mapped_column(ForeignKey("Users.id"))
    status: Mapped[str] = mapped_column(
        String, default="pending"
    )  # e.g., "pending", "accepted"

    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    friend: Mapped["User"] = relationship("User", foreign_keys=[friend_id])
