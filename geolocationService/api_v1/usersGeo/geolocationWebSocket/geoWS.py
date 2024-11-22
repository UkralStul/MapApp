from fastapi import APIRouter, Depends
from fastapi import WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from core.config import settings
from .connectionManager import ConnectionManager
from core.models import db_helper
from api_v1.usersGeo.crud import (
    update_or_create_user_geo,
    get_users_geo,
    get_users_friends_geo,
    get_friend_list,
)
from api_v1.usersGeo.schemas import UserGeoUpdate
from fastapi import status, HTTPException

router = APIRouter(tags=["ws"])
manager = ConnectionManager()


@router.get("/kakish")
async def get_kakish():
    return {"message": "kakish"}


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: int,
    session: AsyncSession = Depends(db_helper.session_dependency),
    user_service_url: str = settings.user_service_url,
):
    # Присоединение нового пользователя
    await websocket.accept()
    print(f"User {user_id} connected")
    manager.active_connections[user_id] = websocket

    try:
        while True:
            data = await websocket.receive_json()
            print("got message", data)
            action = data.get("action")

            if action == "update_geo":
                geo_data = UserGeoUpdate(**data["geo"])
                await update_or_create_user_geo(user_id, geo_data, session)
                token = data.get("token")
                users_friends = await get_friend_list(
                    token=token, user_service_url=user_service_url
                )
                await manager.send_new_user_geo_to_friends(
                    user_id=user_id,
                    friends_ids=users_friends,
                    geo_data=geo_data,
                )
                await session.close()

        # elif action == "get_user_geos":
        #     # Получаем ID пользователей, чьи геоданные нужны
        #     token = data.get("token")
        #     try:
        #         friends_geos = await get_users_friends_geo(
        #             session=session,
        #             user_service_url=user_service_url,
        #             token=token,
        #         )
        #         await websocket.send_json(
        #             {"friends_geos": [geo.dict() for geo in friends_geos]}
        #         )
        #         await session.close()
        #     except HTTPException as e:
        #         await websocket.send_json(
        #             {"error": "Token has expired", "status_code": 401}
        #         )

    except WebSocketDisconnect:
        # Обрабатываем отключение клиента
        del manager.active_connections[user_id]
