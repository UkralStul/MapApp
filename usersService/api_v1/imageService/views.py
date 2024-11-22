from pathlib import Path

from fastapi import APIRouter, Depends, UploadFile, File, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.models import db_helper, User
from auth import get_current_user
from .crud import save_image
from fastapi.responses import FileResponse
from .crud import get_user_avatar

router = APIRouter(tags=["images"])


@router.post("/uploadAvatar", status_code=status.HTTP_200_OK)
async def upload_avatar(
    file: UploadFile = File(...),
    session: AsyncSession = Depends(db_helper.session_dependency),
    user: User = Depends(get_current_user),
):
    return await save_image(session=session, user=user, file=file)


@router.get("/avatar/{user_id}", response_class=FileResponse)
async def get_avatar(
    user_id: int,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    try:
        avatar_path = await get_user_avatar(user_id=user_id, session=session)
        if avatar_path.exists():
            return FileResponse(avatar_path, headers={"Cache-Control": "no-store"})
    except HTTPException as e:
        if e.status_code == 404:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)
        elif e.status_code == 406:
            default_avatar_path = (
                Path(__file__).resolve().parent.parent.parent
                / "uploads/avatars/default-user-image.jpg"
            )
            return FileResponse(
                default_avatar_path, headers={"Cache-Control": "no-store"}
            )
