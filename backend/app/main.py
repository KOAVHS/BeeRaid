import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv

from app.database import Base, engine
from app.routers import auth

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="BeeRaid API")

default_origins = "http://localhost:5173,https://koavhs.github.io"
allowed_origins = os.getenv("FRONTEND_ORIGINS", default_origins).split(",")

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET", "dev-secret-cambia-esto"),
    same_site="none",
    https_only=True,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)


@app.get("/")
def root():
    return {"status": "BeeRaid API corriendo 🐝"}