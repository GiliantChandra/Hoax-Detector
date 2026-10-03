from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from hoax_ml.predict import predict_content_risk, ModelNotFoundError

app = FastAPI(
    title="Smart News & Information Verifier API",
    description="Digital Trust Assistant API to assess content risk and provide trust scores.",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class AnalyzeRequest(BaseModel):
    title: Optional[str] = Field(None, description="Optional title of the news or article")
    text: str = Field(..., description="The main content text to analyze")

class RiskResponse(BaseModel):
    signal: str
    model_version: str
    model_reliability: str
    training_dataset_status: str
    notice: str
    risk_label: str
    risk_score: Optional[float] = None
    reason: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart News & Information Verifier API"}

@app.post("/api/analyze/text", response_model=RiskResponse)
def analyze_text(req: AnalyzeRequest):
    """
    Analyze textual content and return a linguistic risk signal.
    """
    try:
        # Panggil fungsi predict dari package hoax_ml
        result = predict_content_risk(text=req.text, title=req.title)
        return result
    except ModelNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
