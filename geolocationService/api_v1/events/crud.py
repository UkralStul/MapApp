from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.engine import Result

from api_v1.events.schemas import EventCreate, EventUpdate, EventsInArea
from core.models import Event
from sqlalchemy import select


async def get_events(session: AsyncSession) -> list[Event]:
    stmt = select(Event).order_by(Event.id)
    result: Result = await session.execute(stmt)
    events = result.scalars().all()
    return list(events)


async def get_event(session: AsyncSession, event_id: int) -> Event | None:
    return await session.get(Event, event_id)


async def create_event(session: AsyncSession, event_in: EventCreate) -> Event:
    event = Event(**event_in.model_dump())
    session.add(event)
    await session.commit()
    return event


async def update_event(
    session: AsyncSession,
    event: Event,
    event_update: EventUpdate,
) -> Event:
    for name, value in event_update.model_dump(exclude_unset=True).items():
        setattr(event, name, value)
    await session.commit()
    return event


async def delete_event(
    session: AsyncSession,
    event: Event,
) -> None:
    await session.delete(event)
    await session.commit()


async def events_in_area(
    session: AsyncSession,
    area: EventsInArea,
) -> list[Event]:
    stmt = select(Event).filter(
        Event.latitude >= area.min_latitude,
        Event.latitude <= area.max_latitude,
        Event.longitude >= area.min_longitude,
        Event.longitude <= area.max_longitude,
    )
    result: Result = await session.execute(stmt)
    events = result.scalars().all()
    return list(events)
