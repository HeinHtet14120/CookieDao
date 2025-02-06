import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const contractAddress = searchParams.get("contractAddress");

        if (!contractAddress) {
            return NextResponse.json({ success: false, error: "Missing contract address" }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), "public", "tokens.json");
        const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

        const token = jsonData.find((t: any) => t.address === contractAddress);

        if (token) {
            return NextResponse.json({ success: true, data: token });
        }

        return NextResponse.json({ success: false, error: "Token not found" }, { status: 404 });
    } catch (err) {
        console.error("Error fetching local token data:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
