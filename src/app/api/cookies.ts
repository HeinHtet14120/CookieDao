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

export const getAgentsPaged = async (page: number) => {
  try {
    console.log(`🔄 Fetching page ${page} from CookieFun API...`);
    const response = await fetch(`${BASE_URL}${page}&pageSize=25`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ API Error (Page ${page}): ${response.status} - ${response.statusText}`,
      );
      console.error(`🔍 Error Response Body:`, errorText);
      return {
        success: false,
        error: `API Error: ${response.status} - ${response.statusText}`,
        details: errorText,
      };
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return { success: false, error: "Network error", details: error.message };
  }
};

export const cookieApis = {
  getAgentsPaged: async (page = 1, pageSize = 25) => {
    try {
      if (pageSize < 1 || pageSize > 25) {
        throw new Error("Page size must be between 1 and 25");
      }

      console.log(`🔹 Fetching page ${page} from CookieFun API...`);

      const response = await fetch(
        `/api/cookie/v2/agents/agentsPaged?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "x-api-key": API_KEY, // Ensure the API Key is correct
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(
        `✅ Successfully fetched ${data.ok.data.length} tokens from CookieFun API (Page ${page})`,
      );
      return data;
    } catch (error) {
      console.error("❌ Error fetching agents:", error);
      throw error;
    }
  },
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
