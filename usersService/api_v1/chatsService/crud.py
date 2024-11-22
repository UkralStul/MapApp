from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from core.models import Message, Conversation, User
from sqlalchemy import select
from fastapi import HTTPException, status


async def send_message(
    content: str,
    sender_id: int,
    conversation_id: int,
    session: AsyncSession,
) -> Message | Exception:
    # Проверяем, что отправитель является участником беседы
    conversation_stmt = (
        select(Conversation)
        .join(Conversation.users)
        .filter(Conversation.id == conversation_id)
        .filter(User.id == sender_id)  # Проверка, что sender_id в разговоре
    )

    # Выполняем запрос для проверки принадлежности отправителя к беседе
    conversation_result = await session.execute(conversation_stmt)
    conversation = conversation_result.scalars().first()

    # Если отправитель не найден в беседе, выбрасываем ошибку
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sender is not a participant of this conversation",
        )

    # Если беседа найдена, обновляем информацию о последнем сообщении
    if conversation:
        conversation.last_message_text = content
        conversation.last_message_date = datetime.now()
        session.add(conversation)
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )
    # Создаем новое сообщение
    new_message = Message(
        content=content,
        sender_id=sender_id,
        conversation_id=conversation_id,
    )
    session.add(new_message)
    # Сохраняем изменения и возвращаем сообщение
    await session.commit()
    return new_message


async def create_conversation(
    users_ids: list[int],
    session: AsyncSession,
) -> Conversation:
    stmt = select(User).filter(User.id.in_(users_ids))
    user_result = await session.execute(stmt)
    users = user_result.scalars().all()
    new_conversation = Conversation(users=users)
    session.add(new_conversation)
    await session.commit()
    return new_conversation


async def get_conversations(
    user_id: int,
    session: AsyncSession,
) -> list[Conversation]:
    stmt = (
        select(Conversation)
        .filter(Conversation.users.any(User.id == user_id))
        .options(
            selectinload(
                Conversation.users
            )  # Загружаем связанных пользователей для каждого разговора
        )
    )

    # Выполнение запроса
    result = await session.execute(stmt)
    conversations = result.scalars().all()

    if conversations:
        for conversation in conversations:
            conversation.users = [
                user for user in conversation.users if user.id != user_id
            ]

        return list(conversations)
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chats not found",
        )


async def get_messages(
    session: AsyncSession,
    conversation_id: int,
    user_id: int,  # Добавляем user_id для проверки
    per_page: int = 20,
    page: int = 1,
):
    offset = (page - 1) * per_page

    # Строим запрос для проверки, что пользователь является участником беседы
    conversation_stmt = (
        select(Conversation)
        .join(Conversation.users)
        .filter(Conversation.id == conversation_id)
        .filter(User.id == user_id)  # Проверка, что user_id в разговоре
    )

    # Выполнение запроса для проверки принадлежности пользователя к беседе
    conversation_result = await session.execute(conversation_stmt)
    conversation = conversation_result.scalars().first()

    # Если беседа не найдена или пользователь не является участником
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a participant of this conversation",
        )

    # Если пользователь в беседе, выполняем запрос для сообщений
    stmt = (
        select(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.timestamp.desc())  # Сортировка по времени
        .limit(per_page)
        .offset(offset)
        .options(selectinload(Message.sender))  # Прогрузка отправителя сообщения
    )

    result = await session.execute(stmt)
    messages = result.scalars().all()
    if messages:
        return list(messages)
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No messages in this chat",
        )
