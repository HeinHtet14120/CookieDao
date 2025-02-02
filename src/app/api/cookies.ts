const API_KEY = "77cdfd4c-132e-4314-ac93-b8ac64f6a2a8";

if (!API_KEY) {
  console.error(
    "API_KEY not found in environment variables. Make sure REACT_APP_API_KEY is set in .env file",
  );
}

const BASE_URL = "/api/cookie";

const headers = {
  "x-api-key": API_KEY,
  "Content-Type": "application/json",
};

const fetchOptions = {
  method: "GET",
  headers: headers,
};

export const cookieApi = {
  checkQuota: async () => {
    try {
      const response = await fetch(`${BASE_URL}/authorization`, fetchOptions);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error checking quota:", error);
      throw error;
    }
  },

  getAgentByTwitter: async (username: string, interval = "_7Days") => {
    try {
      const response = await fetch(
        `${BASE_URL}/v2/agents/twitterUsername/${username}?interval=${interval}`,
        fetchOptions,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.errorMessage || "API request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching agent by Twitter:", error);
      throw error;
    }
  },

  getAgentByContract: async (address: string, interval = "_7Days") => {
    try {
      const response = await fetch(
        `${BASE_URL}/v2/agents/contractAddress/${address}?interval=${interval}`,
        fetchOptions,
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error?.errorMessage.includes("Data not found")) {
          return {
            success: true,
            ok: { data: null },
          };
        }
        throw new Error(errorData.error?.errorMessage || "API request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching agent by contract:", error);
      return { success: false };
    }
  },

  getAgentsPaged: async (page = 1, interval = "_7Days") => {
    try {
      const pageSize = 15;
      const response = await fetch(
        `${BASE_URL}/v2/agents/agentsPaged?interval=${interval}&page=${page}&pageSize=${pageSize}`,
        fetchOptions,
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (!data || !data.ok || !data.ok.data) {
        throw new Error("Invalid response structure");
      }

      return {
        success: true,
        ok: {
          data: data.ok.data,
          currentPage: page,
          totalPages: Math.ceil(data.ok.totalCount / pageSize),
          totalCount: data.ok.totalCount,
        },
      };
    } catch (error) {
      console.error("Error fetching agents:", error);
      throw error;
    }
  },

  searchTweets: async (query: string, from: string, to: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/v1/hackathon/search/${encodeURIComponent(query)}?from=${from}&to=${to}`,
        fetchOptions,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.errorMessage || "API request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching tweets:", error);
      throw error;
    }
  },
};
