from fastapi import FastAPI
import os
from app.services import fetch_sentiment_data
from app.ai_model import predict_rebalancing
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/")
def home():
    return {"message": "AI-Powered DeFi Portfolio Optimizer Backend"}

@app.get("/sentiment")
def get_sentiment():
    """Fetches sentiment data from Cookie API."""
    sentiment_data = fetch_sentiment_data()
    return sentiment_data

@app.get("/predict")
def predict():
    """Runs AI model to suggest portfolio rebalancing based on sentiment analysis."""
    recommendation = predict_rebalancing()
    return recommendation



if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))  # 🚀 Railway assigns a port dynamically
    print(f"🚀 Starting FastAPI on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)

