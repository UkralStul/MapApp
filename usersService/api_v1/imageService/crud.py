from datetime import datetime
from pathlib import Path

from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.models import User
from sqlalchemy import select

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads/avatars"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


async def save_image(
    session: AsyncSession,
    file: UploadFile,
    user: User,
) -> User:
    extension = file.filename.split(".")[-1]
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"{user.id}_avatar_image_{timestamp}.{extension}"
    file_location = UPLOAD_DIR / filename

    try:
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
    user.profile_photo = filename
    try:
        await session.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not update user: {str(e)}")

    return user


async def get_user_avatar(
    user_id: int,
    session: AsyncSession,
) -> Path:
    stmt = select(User).filter(User.id == user_id)
    result = await session.execute(stmt)
    user = result.scalars().first()
    if user:
        if user.profile_photo:
            return UPLOAD_DIR / user.profile_photo
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="User has no avatar"
        )
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Could not find user"
    )
