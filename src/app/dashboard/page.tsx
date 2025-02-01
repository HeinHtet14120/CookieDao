'use client';

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
        totalCount: 0
    });

    const fetchAgents = async (page: number) => {
        setLoading(true);
        try {
            // Always fetch new data for the requested page
            const response: ApiResponse = await cookieApi.getAgentsPaged(page);
            if (response.success && response.ok?.data) {
                setAgentsCache(prev => ({
                    ...prev,
                    [page]: response.ok.data
                }));
                setCurrentPage(page);
                setPagination({
                    currentPage: page,
                    totalPages: response.ok.totalPages,
                    totalCount: response.ok.totalCount
                });
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.error('Error fetching agents:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch agents');
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

    // Get current page data from cache
    const currentAgents = agentsCache[currentPage] || [];

    return (
        <div className="p-4">
            <AgentDashboard 
                data={currentAgents}
                pagination={pagination}
                loading={loading}
                error={error}
                onPageChange={handlePageChange}
            />
        </div>
    );
}