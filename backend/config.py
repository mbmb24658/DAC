# config.py
import os
from datetime import timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "procurement-secret-key-2024")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-procurement-secret-2024")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # CORS settings
    CORS_ORIGINS = ["http://localhost:5173", "http://localhost:5000", "http://192.168.1.16:5173"]