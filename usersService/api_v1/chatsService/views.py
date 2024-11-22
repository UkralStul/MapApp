from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from auth import get_current_user
from core.models import db_helper, User
from .crud import get_conversations, create_conversation, send_message, get_messages

router = APIRouter(tags=["chat"])


@router.get("/getConversations")
async def get_conversations_view(
    session: AsyncSession = Depends(db_helper.session_dependency),
    user: User = Depends(get_current_user),
):
    return await get_conversations(
        session=session,
        user_id=user.id,
    )


@router.post("/createConversation/{target_user_id}")
async def create_conversation_view(
    target_user_id: int,
    session: AsyncSession = Depends(db_helper.session_dependency),
    user: User = Depends(get_current_user),
):
    return await create_conversation(
        session=session,
        users_ids=[user.id, target_user_id],
    )


@router.post("/sendMessage/{conversation_id}")
async def send_message_view(
    content: str,
    conversation_id: int,
    session: AsyncSession = Depends(db_helper.session_dependency),
    user: User = Depends(get_current_user),
):
    return await send_message(
        content=content,
        conversation_id=conversation_id,
        session=session,
        sender_id=user.id,
    )


@router.get("/getMessages/{conversation_id}")
async def get_messages_view(
    conversation_id: int,
    page: int,
    session: AsyncSession = Depends(db_helper.session_dependency),
    user: User = Depends(get_current_user),
):
    return await get_messages(
        conversation_id=conversation_id,
        page=page,
        session=session,
        user_id=user.id,
    )
