from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone_number: Optional[str]

class UserOut(BaseModel):
    user_id: int
    name: str
    email: EmailStr
    phone_number: Optional[str]
    account_status: str
    created_at: datetime
    last_login: Optional[datetime]
    class Config:
        from_attributes = True

class TransactionBase(BaseModel):
    user_id: int
    amount: float
    timestamp: datetime
    location: str
    payment_method: str
    status: str

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    transaction_id: int
    class Config:
        from_attributes = True

class ScoreOutput(BaseModel):
    transaction_id: int
    fraud_score: float
    decision: str
    threshold_used: float
