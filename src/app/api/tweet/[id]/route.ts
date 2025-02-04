import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  try {
    const response = await fetch(
      `https://api.twitter.com/2/tweets/${id}?tweet.fields=public_metrics,text`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    console.log("this is the response", response);
    if (!response.ok) {
      throw new Error(`Twitter API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      text: data.data.text,
      like_count: data.data.public_metrics.like_count,
      retweet_count: data.data.public_metrics.retweet_count,
      reply_count: data.data.public_metrics.reply_count,
    });
  } catch (error) {
    console.error("Error fetching tweet:", error);
    return NextResponse.json(
      { error: "Failed to fetch tweet data" },
      { status: 500 },
    );
  }
}
