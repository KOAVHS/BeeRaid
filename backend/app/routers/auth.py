import os
import secrets
import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.streamer import Streamer

router = APIRouter(prefix="/auth/twitch", tags=["auth"])

TWITCH_CLIENT_ID = os.getenv("TWITCH_CLIENT_ID")
TWITCH_CLIENT_SECRET = os.getenv("TWITCH_CLIENT_SECRET")
TWITCH_REDIRECT_URI = os.getenv("TWITCH_REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

AUTHORIZE_URL = "https://id.twitch.tv/oauth2/authorize"
TOKEN_URL = "https://id.twitch.tv/oauth2/token"
USERS_URL = "https://api.twitch.tv/helix/users"

SCOPES = "user:read:email"


@router.get("/login")
def login(request: Request):
    """Redirige al usuario a la pantalla de autorizacion de Twitch."""
    state = secrets.token_urlsafe(16)
    request.session["oauth_state"] = state

    params = {
        "client_id": TWITCH_CLIENT_ID,
        "redirect_uri": TWITCH_REDIRECT_URI,
        "response_type": "code",
        "scope": SCOPES,
        "state": state,
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return RedirectResponse(f"{AUTHORIZE_URL}?{query}")


@router.get("/callback")
async def callback(code: str, state: str, request: Request, db: Session = Depends(get_db)):
    """Twitch redirige aqui despues de que el usuario autoriza la app."""
    saved_state = request.session.get("oauth_state")
    if not saved_state or saved_state != state:
        raise HTTPException(status_code=400, detail="State invalido, posible CSRF")

    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            TOKEN_URL,
            data={
                "client_id": TWITCH_CLIENT_ID,
                "client_secret": TWITCH_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": TWITCH_REDIRECT_URI,
            },
        )
        if token_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Error al obtener token de Twitch")

        token_data = token_resp.json()
        access_token = token_data["access_token"]
        refresh_token = token_data["refresh_token"]

        user_resp = await client.get(
            USERS_URL,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Client-Id": TWITCH_CLIENT_ID,
            },
        )
        if user_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Error al obtener datos de usuario")

        user_data = user_resp.json()["data"][0]

    streamer = db.query(Streamer).filter_by(twitch_user_id=user_data["id"]).first()
    if streamer is None:
        streamer = Streamer(twitch_user_id=user_data["id"], login=user_data["login"])
        db.add(streamer)

    streamer.display_name = user_data["display_name"]
    streamer.profile_image_url = user_data.get("profile_image_url")
    streamer.access_token = access_token
    streamer.refresh_token = refresh_token

    db.commit()
    db.refresh(streamer)

    request.session["streamer_id"] = streamer.id

    return RedirectResponse(f"{FRONTEND_URL}/BeeRaid/")


@router.get("/me")
def me(request: Request, db: Session = Depends(get_db)):
    """Devuelve el streamer actualmente logueado, segun la sesion."""
    streamer_id = request.session.get("streamer_id")
    if not streamer_id:
        raise HTTPException(status_code=401, detail="No hay sesion activa")

    streamer = db.query(Streamer).get(streamer_id)
    if not streamer:
        raise HTTPException(status_code=401, detail="Sesion invalida")

    return {
        "id": streamer.id,
        "login": streamer.login,
        "display_name": streamer.display_name,
        "profile_image_url": streamer.profile_image_url,
    }


@router.post("/logout")
def logout(request: Request):
    request.session.clear()
    return {"ok": True}