import { NextResponse } from "next/server";

// Replace this with your actual API key
const API_KEY = "77cdfd4c-132e-4314-ac93-b8ac64f6a2a8";
const COOKIEFUN_API_URL = "https://api.cookie.fun/v2/agents/agentsPaged?interval=_7Days&page=1&pageSize=2";

// ✅ Handle GET requests
export async function GET() {
    try {
        const response = await fetch(COOKIEFUN_API_URL, {
            method: "GET",
            headers: {
                "x-api-key": API_KEY,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch contract count" }, { status: response.status });
        }

        const data = await response.json();
        const totalCount = data.ok.totalCount || 0;

        return NextResponse.json({ totalCount }, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching contract count:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
