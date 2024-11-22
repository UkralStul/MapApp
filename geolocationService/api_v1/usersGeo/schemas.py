from pydantic import BaseModel, ConfigDict


class UserGeoBase(BaseModel):
    latitude: float
    longitude: float


class UserGeoUpdate(UserGeoBase):
    pass


class UserGeo(UserGeoUpdate):
    model_config = ConfigDict(from_attributes=True)
    user_id: int


class UserGeoResponce(UserGeo):
    model_config = ConfigDict(from_attributes=True)
    pass
