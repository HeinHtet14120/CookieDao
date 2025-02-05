'use client'

import { useEffect, useState } from "react";

const Check = () => {
    const [isChecking, setIsChecking] = useState(true);
    const [lastChecked, setLastChecked] = useState<number | null>(null);
    const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    useEffect(() => {
        const checkContracts = async () => {
            try {
                // **Step 1: Check if the JSON file exists**
                const localDataResponse = await fetch("/contractAddresses.json");

                if (!localDataResponse.ok) {
                    console.log("📁 Local contract file missing, fetching from API...");
                    await fetchContractsFromAPI();
                    return;
                }

                // Read local data
                const localContracts = await localDataResponse.json();
                console.log(`📁 Found ${localContracts.length} saved contracts.`);

                // **Step 2: Fetch latest count from CookieFun API**
                const latestCountResponse = await fetch("/api/fetchContractCount");
                const latestCountData = await latestCountResponse.json();
                const latestCount = latestCountData.totalCount;

                console.log(`🌎 Latest CookieFun contract count: ${latestCount}`);

                // **Step 3: Compare Counts**
                if (localContracts.length !== latestCount) {
                    console.log("🔄 Mismatch detected, updating contract data...");
                    await fetchContractsFromAPI();
                } else {
                    console.log("✅ Local data is up-to-date!");
                }
            } catch (error) {
                console.error("❌ Error checking contracts:", error);
            } finally {
                setIsChecking(false);
            }
        };

        // **Step 4: Run daily check**
        const now = Date.now();
        if (!lastChecked || now - lastChecked > CHECK_INTERVAL) {
            console.log("⏳ Checking contract data...");
            setLastChecked(now);
            checkContracts();
        }
    }, []);

    const fetchContractsFromAPI = async () => {
        console.log("🚀 Fetching latest contracts...");
        await fetch("/api/fetchContracts");
    };

    return (
        <div>
            <h1>Contract Checker</h1>
            {isChecking ? <p>Checking contract data...</p> : <p>✅ Data is updated!</p>}
        </div>
    );
};

export default Check;
