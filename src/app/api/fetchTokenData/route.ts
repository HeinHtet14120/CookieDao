import { NextResponse } from "next/server";

const COOKIE_API_KEY = '77cdfd4c-132e-4314-ac93-b8ac64f6a2a8'; //
const COOKIE_API_URL = "https://api.cookie.fun/v2/agents/contractAddress";

export async function GET(req: Request) {
    try {
        // Extract contractAddress from query params
        const { searchParams } = new URL(req.url);
        const contractAddress = searchParams.get("contractAddress");

        if (!contractAddress) {
            return NextResponse.json(
                { success: false, error: "Missing contract address" }, 
                { status: 400 }
            );
        }

        const apiUrl = `${COOKIE_API_URL}/${contractAddress}?interval=_3Days`;

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: { "x-api-key": COOKIE_API_KEY },
        });

        // Handle different response statuses
        if (response.status === 404) {
            return NextResponse.json({ 
                success: false, 
                error: "Token not found in CookieFun database",
                data: {
                    ok: {
                        agentName: "Unknown",
                        price: null,
                        marketCap: null,
                        priceDeltaPercent: 0,
                        liquidity: null,
                        volume24Hours: null,
                        holdersCount: null
                    }
                }
            });
        }

        if (!response.ok) {
            console.error("CookieFun API error:", {
                status: response.status,
                statusText: response.statusText,
                url: apiUrl
            });
            return NextResponse.json(
                { 
                    success: false, 
                    error: `API error: ${response.status} ${response.statusText}`,
                    data: null 
                }, 
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("❌ Error fetching data from CookieFun API:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to fetch token data",
                data: {
                    ok: {
                        agentName: "Unknown",
                        price: null,
                        marketCap: null,
                        priceDeltaPercent: 0,
                        liquidity: null,
                        volume24Hours: null,
                        holdersCount: null
                    }
                }
            }, 
            { status: 500 }
        );
    }
}
