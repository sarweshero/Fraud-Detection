from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
import face_recognition
from io import BytesIO
from PIL import Image
import numpy as np
from sqlalchemy.orm import Session
from . import models
from . import schemas
from . import crud
from .database import SessionLocal, engine
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

@app.post("/face-auth")
async def face_auth(file: UploadFile = File(...)):
    # Load reference image
    reference_image = face_recognition.load_image_file("me1_croped.jpg")
    reference_encodings = face_recognition.face_encodings(reference_image)
    if not reference_encodings:
        raise HTTPException(status_code=500, detail="No face found in reference image.")
    reference_encoding = reference_encodings[0]

    # Load uploaded image
    contents = await file.read()
    img = Image.open(BytesIO(contents)).convert("RGB")
    np_img = np.array(img)
    uploaded_encodings = face_recognition.face_encodings(np_img)
    if not uploaded_encodings:
        return {"authenticated": False, "reason": "No face detected in uploaded image."}
    uploaded_encoding = uploaded_encodings[0]

    # Compare faces
    match = face_recognition.compare_faces([reference_encoding], uploaded_encoding, tolerance=0.5)[0]
    return {"authenticated": bool(match)}

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
