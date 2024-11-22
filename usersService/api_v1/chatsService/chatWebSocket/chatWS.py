from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from auth import get_current_user
from core.models import db_helper, Message, Conversation
from .connection_manager import ConnectionManager
from ..crud import send_message
from ..schemas import MessageToBroadcast

router = APIRouter()

manager = ConnectionManager()


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    user = await get_current_user(token, session=session)

    await manager.connect(user.id, websocket)

    try:
        while True:
            data = await websocket.receive_json()
            print(data)
            chat_id = data["chat_id"]
            message_text = data["message"]
            receiver_id = data["receiver_id"]

            new_message = await send_message(
                conversation_id=chat_id,
                content=message_text,
                session=session,
                sender_id=user.id,
            )

            message_to_broadcast = MessageToBroadcast(
                id=new_message.id,
                sender_id=user.id,
                content=message_text,
                timestamp=new_message.timestamp.strftime("%m/%d/%Y, %H:%M:%S"),
            )

            # Отправляем сообщение всем участникам чата
            await manager.broadcast(message_to_broadcast, [user.id, receiver_id])

            if receiver_id not in manager.active_connections:
                # Если получатель не в сети, отправляем push-уведомление
                # send push
                continue

    except WebSocketDisconnect:
        manager.disconnect(user.id)
