from typing import Annotated

from fastapi import Depends, HTTPException, status, Path
from sqlalchemy.ext.asyncio import AsyncSession

from . import crud
from core.models import db_helper, Event


async def event_by_id(
    event_id: Annotated[int, Path],
    session: AsyncSession = Depends(db_helper.session_dependency),
) -> Event:
    event = await crud.get_event(session=session, event_id=event_id)
    if event is not None:
        return event
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Event not found",
    )
