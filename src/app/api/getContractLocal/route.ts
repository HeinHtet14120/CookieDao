import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 🔹 Define the path to the JSON file
const CONTRACT_FILE_PATH = path.join(process.cwd(), "public", "contractAddresses.json");

// ✅ API Route to Fetch Contracts
export async function GET() {
    try {
        // 🔹 Read the JSON file
        const fileContent = fs.readFileSync(CONTRACT_FILE_PATH, "utf-8");
        const jsonData = JSON.parse(fileContent);

        return NextResponse.json({ success: true, data: jsonData });
    } catch (err) {
        console.error("❌ Error reading contract JSON file:", err);
        return NextResponse.json({ success: false, error: "Failed to load contract data" }, { status: 500 });
    }
}
