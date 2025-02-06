"use client";

import { cookieApi } from "@/app/api/cookies";
import { useEffect, useState } from "react";
import { Agent, ApiResponse } from "@/types/api";
import AgentDashboard from "@/components/AgentDashboard";
import axios from "axios";

export default function DashboardPage() {
  const [agentsCache, setAgentsCache] = useState<Record<number, Agent[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchResults, setSearchResults] = useState<Agent[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [aiPredictions, setAiPredictions] = useState<{ [key: string]: string }>(
      {},
  );

  useEffect(() => {
    const fetchAiPredictions = async () => {
      console.log("Fetching AI predictions..."); // 🟢 Step 1: Debug Start

      // 1️⃣ Check if cached AI predictions exist
      const cachedData = localStorage.getItem("ai_predictions");
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const lastFetchedDate = parsedData.date;
        const today = new Date().toISOString().split("T")[0];

        // 2️⃣ If cache is from today, use it
        if (lastFetchedDate === today) {
          console.log("✅ Using cached AI predictions.");
          setAiPredictions(parsedData.predictions);
          return;
        }
      }

      // 3️⃣ Otherwise, fetch new predictions
      try {
        const response = await axios.get("http://127.0.0.1:8000/predict");

        console.log("Response received ✅", response);
        console.log("AI Predictions:", response.data);

        setAiPredictions(response.data);

        // 4️⃣ Save new predictions to localStorage
        const jsonData = {
          date: new Date().toISOString().split("T")[0], // Save today's date
          predictions: response.data,
        };
        localStorage.setItem("ai_predictions", JSON.stringify(jsonData));

      } catch (error) {
        console.error("❌ Error fetching AI predictions:", error);
        setAiPredictions({});
      }
    };

    fetchAiPredictions();
  }, []);

  const fetchAgents = async (page: number) => {
    setLoading(true);
    try {
      // Fetch agent data from Cookie API
      const response: ApiResponse = await cookieApi.getAgentsPaged(page);
      if (response.success && response.ok?.data) {
        setAgentsCache((prev) => ({
          ...prev,
          [page]: response.ok.data,
        }));
        setCurrentPage(page);
        setPagination({
          currentPage: page,
          totalPages: response.ok.totalPages,
          totalCount: response.ok.totalCount,
        });
        setAgents(response.ok.data);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      setError(
          error instanceof Error ? error.message : "Failed to fetch agents",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string, type: "contract" | "twitter") => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      if (!query) {
        setSearchResults([]);
        setHasSearched(false);
        return;
      }

      const result =
          type === "contract"
              ? await cookieApi.getAgentByContract(query)
              : await cookieApi.getAgentByTwitter(query);

      if (result?.success && result.ok) {
        console.log("result", result.ok.data);

        if (result.ok.data === null) {
          setSearchResults([]);
        } else {
          setSearchResults([result.ok]);
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
      if (
          !(error instanceof Error && error.message.includes("Data not found"))
      ) {
        setError(error instanceof Error ? error.message : "Search failed");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchAgents(newPage);
  };

  return (
      <div className="p-4 h-screen w-full bg-black/100 border-none backdrop-blur-lg rounded-xl border shadow-xl ">
        <AgentDashboard
            data={hasSearched ? searchResults : agents}
            pagination={pagination}
            loading={loading}
            error={error}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            aiPredictions={aiPredictions}
        />
      </div>
  );
}
