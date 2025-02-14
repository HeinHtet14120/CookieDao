import torch
import torch.nn as nn
import os
import threading
from datetime import datetime
from app.services import fetch_sentiment_data

MODEL_PATH = "model.pth"
LAST_TRAINED_PATH = "last_trained.txt"

class DeFiRebalancingModel(nn.Module):
    def __init__(self, input_size):
        super(DeFiRebalancingModel, self).__init__()
        self.fc1 = nn.Linear(input_size, 64)
        self.fc2 = nn.Linear(64, 32)
        self.fc3 = nn.Linear(32, 1)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        return self.fc3(x)

def train_model():
    """Train AI Model using Cookie API Sentiment Data (Runs in Background)"""
    print("🚀 Training AI Model in Background...")

    sentiment_data = fetch_sentiment_data()
    if "error" in sentiment_data:
        print("🚨 Error fetching sentiment data:", sentiment_data["error"])
        return

    X_train = torch.tensor(
        [[data["sentiment_score"], data["price"], data["mindshare"], data["engagements"]] for data in sentiment_data],
        dtype=torch.float32
    )
    y_train = torch.tensor(
        [[1 if data["sentiment_score"] > 5000 else -1] for data in sentiment_data],
        dtype=torch.float32
    )

    model = DeFiRebalancingModel(input_size=4)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
    loss_fn = nn.MSELoss()

    for epoch in range(1000):
        optimizer.zero_grad()
        predictions = model(X_train)
        loss = loss_fn(predictions, y_train)
        loss.backward()
        optimizer.step()

        if epoch % 100 == 0:
            print(f"Epoch {epoch}: Loss = {loss.item()}")

    # Save trained model
    torch.save(model.state_dict(), MODEL_PATH)

    # Save last trained date
    with open(LAST_TRAINED_PATH, "w") as f:
        f.write(datetime.now().strftime("%Y-%m-%d"))

    print("✅ AI Model Training Completed & Saved!")

def load_model():
    """Load AI model or train asynchronously"""
    model = DeFiRebalancingModel(4)

    if os.path.exists(MODEL_PATH):
        model.load_state_dict(torch.load(MODEL_PATH))
        print("✅ Model loaded successfully!")
    else:
        print("🚨 No model found! Training in the background...")
        threading.Thread(target=train_model, daemon=True).start()  # Start training in the background

    return model

model = load_model()

def predict_rebalancing():
    """AI-driven portfolio rebalancing with improved sentiment comparison."""
    sentiment_data = fetch_sentiment_data()
    avg_sentiment = sum([t["sentiment_score"] for t in sentiment_data]) / len(sentiment_data)

    predictions = {}

    for token_data in sentiment_data:
        token = token_data["token"]
        sentiment_score = token_data["sentiment_score"]

        if sentiment_score > avg_sentiment:
            predictions[token] = "Increase allocation"
        else:
            predictions[token] = "Reduce allocation"

    return predictions
