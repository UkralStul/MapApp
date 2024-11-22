from pydantic import BaseModel
from pydantic_settings import BaseSettings


class AuthJWT(BaseModel):
    secret_key: str = "c68c9b1c20f7242d3a7aa2a4a6ae7d74be5ff6b3d0846a8fb2043c2252d73e52"
    refresh_secret_key: str = (
        "e12b870b0b174238f0985e8e83e1b255f30c784b27384e20a1d5898cdd06f4e8"
    )
    algorithm: str = "HS256"


class Settings(BaseSettings):
    api_v1_prefix: str = "/api/v1"
    db_url: str = "postgresql+asyncpg://postgres:7243@db1:5432/geoService"
    echo: bool = False
    user_service_url: str = "http://usersService:8000"
    auth_jwt: AuthJWT = AuthJWT()


settings = Settings()
