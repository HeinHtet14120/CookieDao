import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const API_KEY = '77cdfd4c-132e-4314-ac93-b8ac64f6a2a8';
const BASE_URL =
    "https://api.cookie.fun/v2/agents/agentsPaged?interval=_7Days&page=";
const CONTRACTS_FILE_PATH = path.join(process.cwd(), "public/contractAddresses.json");

// ✅ Define the expected data structure
type Contract = {
  chain: string;
  contractAddress: string;
};

type Token = {
  agentName: string;
  contracts: Contract[];
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchContracts() {
  try {
    const allContracts: { agentName: string; chain: string; contractAddress: string }[] = [];
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

      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} - ${response.statusText}`);
        return;
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.ok.data)) {
        (data.ok.data as Token[]).forEach((token) => {
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
    console.log("📁 Updated contractAddresses.json ✅");
  } catch (error) {
    console.error("❌ Error fetching token contracts:", error);
  }
}

// ✅ Export API Route
export async function GET() {
  await fetchContracts();
  return NextResponse.json({ success: true, message: "Contracts updated successfully" });
}
