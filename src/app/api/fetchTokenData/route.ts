import { NextResponse } from "next/server";

const COOKIE_API_KEY = "77cdfd4c-132e-4314-ac93-b8ac64f6a2a8"; // 🔹 Replace with your actual API key
const COOKIE_API_URL = "https://api.cookie.fun/v2/agents/contractAddress";

export async function GET(req: Request) {
    try {
        // Extract contractAddress from query params
        const { searchParams } = new URL(req.url);
        const contractAddress = searchParams.get("contractAddress");

        if (!contractAddress) {
            return NextResponse.json({ success: false, error: "Missing contract address" }, { status: 400 });
        }

        const apiUrl = `${COOKIE_API_URL}/${contractAddress}?interval=_3Days`;

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: { "x-api-key": COOKIE_API_KEY },
        });

        if (!response.ok) {
            throw new Error(`CookieFun API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("❌ Error fetching data from CookieFun API:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch token data" }, { status: 500 });
    }
}
