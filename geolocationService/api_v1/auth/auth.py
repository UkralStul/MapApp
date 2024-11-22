from datetime import datetime
import time
import jwt

from core.config import settings


async def decode_access_token(
    token: str,
    algorithm: str = settings.auth_jwt.algorithm,
    secret: str = settings.auth_jwt.secret_key,
) -> str:
    try:
        payload = jwt.decode(token, secret, algorithms=[algorithm])
        user_id: str = payload.get("sub")
        exp = payload.get("exp")
        if exp < time.mktime(datetime.now().timetuple()):
            raise ValueError("Token has expired")
        if user_id is None:
            raise ValueError("User ID not found in token")
        return user_id
    except jwt.PyJWTError:
        raise ValueError("Token is invalid or has expired")
