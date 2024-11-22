from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from .crud import (
    accept_friend_request,
    remove_friend,
    send_friends_request,
    get_friends,
)
from core.models import db_helper, User
from auth import get_current_user

router = APIRouter(tags=["friends"])


@router.post("/sendFriendsRequest", status_code=status.HTTP_200_OK)
async def send_friends_request_view(
    target_user_id: int,
    session: AsyncSession = Depends(db_helper.session_dependency),
    user: User = Depends(get_current_user),
):
    return await send_friends_request(user.id, target_user_id, session)


@router.post("/acceptFriendsRequest", status_code=status.HTTP_202_ACCEPTED)
async def accept_request_view(
    target_user_id: int,
    session: AsyncSession = Depends(db_helper.session_dependency),
    user: User = Depends(get_current_user),
):
    return await accept_friend_request(user.id, target_user_id, session)


@router.delete("/removeFriend", status_code=status.HTTP_202_ACCEPTED)
async def remove_friend_view(
    target_user_id: int,
    session: AsyncSession = Depends(db_helper.session_dependency),
    user: User = Depends(get_current_user),
):
    return await remove_friend(user.id, target_user_id, session)


@router.get("/friendsList")
async def get_frineds_list(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await get_friends(user_id=user.id, session=session)
