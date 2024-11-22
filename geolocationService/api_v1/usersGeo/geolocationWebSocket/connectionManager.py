from typing import Dict
from fastapi import WebSocket

from api_v1.usersGeo.schemas import UserGeoUpdate


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    # Подключение нового пользователя
    async def connect(self, user_id: str, websocket: WebSocket):
        self.active_connections[user_id] = websocket
        await websocket.accept()

    # Отключение пользователя
    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_new_user_geo_to_friends(
        self,
        friends_ids: list[int],
        geo_data: UserGeoUpdate,
        user_id: int,
    ):
        for friend_id in friends_ids:
            if friend_id in self.active_connections:
                try:
                    print("sending message to:", friend_id)
                    websocket = self.active_connections[friend_id]
                    await websocket.send_json(
                        {
                            "action": "update_friend_geo",
                            "user_id": user_id,
                            "geo": geo_data.model_dump(),
                        }
                    )
                except Exception as e:
                    print(f"Ошибка отправки геоданных для друга {friend_id}: {e}")
