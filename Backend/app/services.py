import json
import requests

# Load API key from environment variable (keep it secure)
COOKIE_API_KEY = "77cdfd4c-132e-4314-ac93-b8ac64f6a2a8"
BASE_URL = "https://api.cookie.fun"

headers = {
    "x-api-key": COOKIE_API_KEY,
    "Content-Type": "application/json"
}

def calculate_sentiment(agent):
    """Estimate sentiment score based on mindshare, engagements, and followers."""
    mindshare = agent.get("mindshare", 0)
    engagements = agent.get("averageEngagementsCount", 0)
    followers = agent.get("followersCount", 0)
    smart_engagements = sum(tweet["smartEngagementPoints"] for tweet in agent.get("topTweets", []))

    # Weighted sentiment calculation
    sentiment_score = (
            (mindshare * 0.4) +  # Mindshare importance (40%)
            (engagements * 0.3) +  # Engagements importance (30%)
            (smart_engagements * 0.2) +  # Smart engagement points (20%)
            (followers * 0.1)  # Follower count impact (10%)
    )

    return round(sentiment_score, 2)  # Round for readability

def fetch_sentiment_data():
    """Fetches all pages of social-driven sentiment data from Cookie API."""
    all_data = []
    page = 1
    page_size = 25  # Keep fetching in batches of 25

    while True:
        url = f"{BASE_URL}/v2/agents/agentsPaged?interval=_7Days&page={page}&pageSize={page_size}"

        try:
            response = requests.get(url, headers=headers)
            response_json = response.json()

            if not response_json.get("success") or "ok" not in response_json:
                return {"error": f"Failed to fetch data. Response: {response_json}"}

            crypto_data = response_json["ok"]["data"]

            if not crypto_data:
                break  # Stop fetching if the page has no data (last page reached)

            # Format and calculate sentiment scores
            formatted_data = [
                {
                    "token": agent["agentName"],
                    "sentiment_score": calculate_sentiment(agent),
                    "price": agent.get("price", 0),
                    "mindshare": agent.get("mindshare", 0),
                    "engagements": agent.get("averageEngagementsCount", 0),
                    "followers": agent.get("followersCount", 0)
                }
                for agent in crypto_data
            ]

            all_data.extend(formatted_data)
            page += 1  # Move to the next page

        except requests.RequestException as e:
            return {"error": f"API request failed: {str(e)}"}

    return all_data  # Return the complete dataset
