import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const API_KEY = "77cdfd4c-132e-4314-ac93-b8ac64f6a2a8";
const BASE_URL = "https://api.cookie.fun/v2/agents/agentsPaged?interval=_7Days&page=";
const CONTRACTS_FILE_PATH = path.join(process.cwd(), "public/contractAddresses.json");

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET() {
    try {
        let allContracts = [];
        let page = 1;
        let hasMorePages = true;

        while (hasMorePages) {
            console.log(`🔄 Fetching page ${page} from CookieFun API...`);

            const response = await fetch(`${BASE_URL}${page}&pageSize=25`, {
                method: "GET",
                headers: {
                    "x-api-key": API_KEY,
                },
            });

            // ✅ Log the full response for debugging
            console.log(`🔹 Response Status: ${response.status}`);
            console.log(`🔹 Response Headers:`, response.headers);
            const text = await response.text();
            console.log(`🔹 Response Body: ${text}`);

            // ❌ If not OK, log the response & return
            if (!response.ok) {
                console.error(`❌ API Error (Page ${page}): ${response.status} - ${response.statusText}`);
                return NextResponse.json({ error: "Failed to fetch contracts", details: text }, { status: response.status });
            }

            const data = JSON.parse(text);

            if (data.success && data.ok.data) {
                data.ok.data.forEach((token) => {
                    token.contracts.forEach((contract) => {
                        allContracts.push({
                            agentName: token.agentName,
                            chain: contract.chain,
                            contractAddress: contract.contractAddress,
                        });
                    });
                });
                hasMorePages = page < data.ok.totalPages && allContracts.length < data.ok.totalCount;
                page++;
            } else {
                hasMorePages = false;
            }

            await delay(2000);
        }

        fs.writeFileSync(CONTRACTS_FILE_PATH, JSON.stringify(allContracts, null, 2));
        console.log("📁 Updated contractAddresses.json");

        return NextResponse.json({ success: true, count: allContracts.length }, { status: 200 });

    } catch (error) {
        console.error("❌ Error fetching token contracts:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
