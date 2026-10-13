import os
import sqlite3
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.config import settings

# Engine setup
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)

# Enforce SQLite foreign keys
if settings.DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initializes the database schema and seeds realistic demo data if empty."""
    db_file = "bharatyatra.db"
    
    # Check if database has tables
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute("SELECT count(name) FROM sqlite_master WHERE type='table' AND name='TourPackages'")
    has_packages = cursor.fetchone()[0] > 0
    conn.close()

    if not has_packages:
        print("[DATABASE] Initializing schema and seed data...")
        schema_path = os.path.join(os.path.dirname(__file__), "..", "sql", "schema_sqlite.sql")
        seed_path = os.path.join(os.path.dirname(__file__), "..", "sql", "seed_data.sql")
        
        conn = sqlite3.connect(db_file)
        with open(schema_path, "r", encoding="utf-8") as f:
            conn.executescript(f.read())
        with open(seed_path, "r", encoding="utf-8") as f:
            conn.executescript(f.read())
        conn.close()
        print("[DATABASE] Schema created and seed data loaded successfully!")
