from pydantic import BaseModel


class UserBase(BaseModel):
    id: int
    username: str
    email: str


class TokenData(BaseModel):
    token: str
