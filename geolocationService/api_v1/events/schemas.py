from pydantic import BaseModel, ConfigDict


class EventBase(BaseModel):
    name: str
    description: str
    latitude: float
    longitude: float


class EventCreate(EventBase):
    created_by: int


class EventUpdate(EventBase):
    name: str | None = None
    description: str | None = None


class Event(EventBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class EventsInArea(BaseModel):
    min_latitude: float
    max_latitude: float
    min_longitude: float
    max_longitude: float
