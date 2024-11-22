from typing import List, Dict
from fastapi import WebSocket

from ..schemas import MessageToBroadcast


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    # Подключение нового пользователя
    async def connect(self, user_id: str, websocket: WebSocket):
        self.active_connections[user_id] = websocket
        await websocket.accept()

    # Отключение пользователя
    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    # Отправка сообщения определённому пользователю
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    # Отправка сообщения всем участникам конкретного чата
    async def broadcast(self, message: MessageToBroadcast, targets: List[str]):
        message_to_send = message.dict()
        print(f"Sending message: {message_to_send}")
        for user_id in targets:
            if user_id in self.active_connections:
                connection = self.active_connections[user_id]
                await connection.send_json(message_to_send)
