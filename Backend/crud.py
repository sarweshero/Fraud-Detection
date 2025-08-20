from sqlalchemy.orm import Session
from . import models
from . import schemas

def create_user(db: Session, user_in: schemas.UserCreate):
    user = models.User(name=user_in.name, email=user_in.email, phone_number=user_in.phone_number)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_transaction(db: Session, tx: schemas.TransactionCreate, score: float, decision: str):
    record = models.Transaction(
        **tx.dict(),
        fraud_score=score,
        decision=decision,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
