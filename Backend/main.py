from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
import crud
from database import SessionLocal, engine
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

# Load model (placeholder path)
try:
    pipeline = joblib.load("models/demo_pipeline_no_smote.joblib")
except Exception:
    pipeline = None

models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="Credit Card Fraud Detection")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

from typing import List

@app.get("/users", response_model=List[schemas.UserOut])
def list_users(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)

@app.post("/score", response_model=schemas.ScoreOutput)
def score_transaction(tx: schemas.TransactionCreate, db: Session = Depends(get_db)):
    proba = 0.0
    decision = "Review"
    threshold = 0.15

    if pipeline is not None:
        df = pd.DataFrame([tx.dict()])
        # NOTE: real feature engineering must mirror training pipeline
        if hasattr(pipeline, "predict_proba"):
            proba = pipeline.predict_proba(df.loc[:, ["amount"]])[:,1][0]
        
        decision = "Approve" if proba < threshold else "Review" if proba < (threshold + 0.1) else "Decline"

    db_tx = crud.create_transaction(db, tx, score=proba, decision=decision)
    
    return schemas.ScoreOutput(
        transaction_id=db_tx.transaction_id,
        fraud_score=proba,
        decision=decision,
        threshold_used=threshold,
    )
