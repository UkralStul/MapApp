from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.models.Friendship import Friendship
from fastapi import HTTPException


async def send_friends_request(
    user_id: int,
    target_user_id: int,
    session: AsyncSession,
):
    stmt_check_if_request_already_exist = select(Friendship).filter(
        (Friendship.user_id == user_id) & (Friendship.friend_id == target_user_id)
    )
    stmt_check_if_friend_request_already_sent_by_target_user = select(
        Friendship
    ).filter(
        (Friendship.friend_id == user_id) & (Friendship.user_id == target_user_id),
    )
    already_exist = await session.execute(stmt_check_if_request_already_exist)
    if already_exist.scalars().first():
        raise HTTPException(
            status_code=400, detail="Friend request already sent or already friends."
        )
    sent_by_target_user = await session.execute(
        stmt_check_if_friend_request_already_sent_by_target_user
    )
    friedship_already_sent = sent_by_target_user.scalars().first()
    if friedship_already_sent:
        friedship_already_sent.status = "accepted"
        await session.commit()
        return {"message": "Friendship established."}

    new_friendship_request = Friendship(
        user_id=user_id, friend_id=target_user_id, status="pending"
    )
    session.add(new_friendship_request)
    await session.commit()
    return {"message": "Friend request sent."}


async def accept_friend_request(
    user_id: int,
    target_user_id: int,
    session: AsyncSession,
):
    # Check if a pending friend request exists
    stmt = select(Friendship).filter(
        (Friendship.user_id == target_user_id)
        & (Friendship.friend_id == user_id)
        & (Friendship.status == "pending")
    )

    pending_request = await session.execute(stmt)

    if not pending_request.scalars().first():
        raise HTTPException(status_code=400, detail="No pending friend request found.")

    # Update the status of the friendship to accepted
    stmt_update = select(Friendship).filter(
        (Friendship.user_id == target_user_id) & (Friendship.friend_id == user_id)
    )

    friendship = await session.execute(stmt_update)
    friendship_entry = friendship.scalars().first()

    if friendship_entry:
        friendship_entry.status = "accepted"
        await session.commit()

        return {"message": "Friend request accepted."}


async def remove_friend(
    user_id: int,
    target_user_id: int,
    session: AsyncSession,
):
    stmt = select(Friendship).filter(
        ((Friendship.user_id == user_id) & (Friendship.friend_id == target_user_id))
        | ((Friendship.user_id == target_user_id) & (Friendship.friend_id == user_id))
    )

    friendship = await session.execute(stmt)
    friendship_entry = friendship.scalars().first()

    if not friendship_entry:
        raise HTTPException(status_code=400, detail="No friendship exists.")

    await session.delete(friendship_entry)
    await session.commit()

    return {"message": "Friendship removed."}


async def get_friends(
    user_id: int,
    session: AsyncSession,
):
    friend_records = []

    stmt_as_user = select(Friendship.friend_id).filter(
        (Friendship.user_id == user_id) & (Friendship.status == "accepted")
    )

    stmt_as_friend = select(Friendship.user_id).filter(
        (Friendship.friend_id == user_id) & (Friendship.status == "accepted")
    )

    friends_as_user = await session.execute(stmt_as_user)
    friends_as_friend = await session.execute(stmt_as_friend)

    friend_records.extend(friends_as_user.scalars().all())
    friend_records.extend(friends_as_friend.scalars().all())

    return friend_records
