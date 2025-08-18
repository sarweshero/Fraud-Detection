from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Using SQLite for development
DATABASE_URL = "sqlite:///./frauddb.sqlite"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}, echo=False, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
