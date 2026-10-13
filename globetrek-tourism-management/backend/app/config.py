import os

class Settings:
    PROJECT_NAME: str = "GlobeTrek - Worldwide Tourism & Travel Booking Management System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./bharatyatra.db")
    
    # JWT Security Configuration
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "globetrek-super-secret-jwt-key-2026-secure")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # SMTP Email Configuration (Supports Gmail, SendGrid, Mailgun, Amazon SES, or custom SMTP)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "bookings@globetrek.com")
    SMTP_FROM_NAME: str = os.getenv("SMTP_FROM_NAME", "GlobeTrek Holidays")

settings = Settings()
