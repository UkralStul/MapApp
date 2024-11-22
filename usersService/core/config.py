from pathlib import Path

from pydantic import BaseModel
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).parent.parent


class AuthJWT(BaseModel):
    secret_key: str = "c68c9b1c20f7242d3a7aa2a4a6ae7d74be5ff6b3d0846a8fb2043c2252d73e52"
    refresh_secret_key: str = (
        "e12b870b0b174238f0985e8e83e1b255f30c784b27384e20a1d5898cdd06f4e8"
    )
    algorithm: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7


class Settings(BaseSettings):
    api_v1_prefix: str = "/api/v1"
    db_url: str = "postgresql+asyncpg://postgres:7243@db2:5432/userService"
    echo: bool = False
    auth_jwt: AuthJWT = AuthJWT()


settings = Settings()
