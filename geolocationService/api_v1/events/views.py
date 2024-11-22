from fastapi import APIRouter, HTTPException, status, Depends
from . import crud
from .schemas import Event, EventCreate, EventUpdate, EventsInArea
from core.models import db_helper
from sqlalchemy.ext.asyncio import AsyncSession
from .dependencies import event_by_id

router = APIRouter(tags=["Events"])


@router.get("/", response_model=list[Event])
async def get_events(
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await crud.get_events(session=session)


@router.get("/{event_id}/", response_model=Event)
async def get_event(
    event: Event = Depends(event_by_id),
):
    return event


@router.post("/", response_model=Event)
async def create_event(
    event_in: EventCreate,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await crud.create_event(session=session, event_in=event_in)


@router.patch("/{event_id}/")
async def update_event(
    event_update: EventUpdate,
    event: Event = Depends(event_by_id),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await crud.update_event(
        session=session,
        event=event,
        event_update=event_update,
    )


@router.delete("/{event_id}/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(
    event: Event = Depends(event_by_id),
    session: AsyncSession = Depends(db_helper.session_dependency),
) -> None:
    await crud.delete_event(session=session, event=event)


@router.post("/events_in_area/")
async def events_in_area(
    area: EventsInArea,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await crud.events_in_area(area=area, session=session)
