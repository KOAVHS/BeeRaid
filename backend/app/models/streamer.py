from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from app.database import Base


class Streamer(Base):
    __tablename__ = "streamers"

    id = Column(Integer, primary_key=True, index=True)
    twitch_user_id = Column(String, unique=True, index=True, nullable=False)
    login = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=False)
    profile_image_url = Column(String, nullable=True)

    access_token = Column(String, nullable=False)
    refresh_token = Column(String, nullable=False)

    is_live = Column(Boolean, default=False)
    current_category = Column(String, nullable=True)
    current_language = Column(String, nullable=True)
    current_viewer_count = Column(Integer, default=0)
    last_checked_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, server_default=func.now())