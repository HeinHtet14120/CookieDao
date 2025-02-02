"use client";

import { cookieApi } from "@/app/api/cookies";
import { useEffect, useState } from "react";
import { Agent, ApiResponse } from "@/types/api";
import AgentDashboard from "@/components/AgentDashboard";

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

  const fetchAgents = async (page: number) => {
    setLoading(true);
    try {
      // Always fetch new data for the requested page
      const response: ApiResponse = await cookieApi.getAgentsPaged(page);
      console.log(response);
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
    <div className="p-4 h-full w-full bg-black/10 backdrop-blur-lg rounded-xl border dark:border-white/20 shadow-xl ">
      <AgentDashboard
        data={hasSearched ? searchResults : agents}
        pagination={pagination}
        loading={loading}
        error={error}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />
    </div>
  );
}
