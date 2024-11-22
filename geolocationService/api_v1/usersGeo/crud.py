import httpx
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from api_v1.usersGeo.schemas import UserGeoUpdate, UserGeoResponce
from core.models.UserGeo import UserGeo
from fastapi import status, HTTPException


async def update_or_create_user_geo(
    user_id: int,
    new_geo: UserGeoUpdate,
    session: AsyncSession,
) -> UserGeo:
    try:
        user_geo = await session.execute(
            select(UserGeo).where(UserGeo.user_id == user_id)
        )
        user_geo = user_geo.scalar_one()

        for name, value in new_geo.model_dump(exclude_unset=True).items():
            setattr(user_geo, name, value)
    except NoResultFound:
        user_geo = UserGeo(user_id=user_id, **new_geo.model_dump())
        session.add(user_geo)

    await session.commit()
    return user_geo


async def get_users_geo(
    user_ids: list[int],
    session: AsyncSession,
) -> list[UserGeoResponce]:
    result = await session.execute(select(UserGeo).where(UserGeo.user_id.in_(user_ids)))
    user_geos = result.scalars().all()

    return [UserGeoResponce.model_validate(user_geo) for user_geo in user_geos]


async def get_friend_list(
    token: str,
    user_service_url: str,
):
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{user_service_url}/api/v1/friends/friendsList",
            headers=headers,
        )

    if response.status_code == 200:
        friend_ids = response.json()
        return friend_ids
    elif response.status_code == 401:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )
    else:
        raise Exception("Не удалось получить список друзей пользователя")


async def get_users_friends_geo(
    token: str,
    session: AsyncSession,
    user_service_url: str,
) -> list[UserGeoResponce]:
    friend_ids = await get_friend_list(token=token, user_service_url=user_service_url)

    friends_geo = await get_users_geo(user_ids=friend_ids, session=session)

    return friends_geo
