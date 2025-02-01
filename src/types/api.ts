export interface Tweet {
    tweetUrl: string;
    tweetAuthorProfileImageUrl: string;
    tweetAuthorDisplayName: string;
    smartEngagementPoints: number;
    impressionsCount: number;
}

export interface Contract {
    chain: number;
    contractAddress: string;
}

export interface Agent {
    agentName: string;
    contracts: Contract[];
    twitterUsernames: string[];
    mindshare: number;
    mindshareDeltaPercent: number;
    marketCap: number;
    marketCapDeltaPercent: number;
    price: number;
    priceDeltaPercent: number;
    liquidity: number;
    volume24Hours: number;
    volume24HoursDeltaPercent: number;
    holdersCount: number;
    holdersCountDeltaPercent: number;
    averageImpressionsCount: number;
    averageImpressionsCountDeltaPercent: number;
    averageEngagementsCount: number;
    averageEngagementsCountDeltaPercent: number;
    followersCount: number;
    smartFollowersCount: number;
    topTweets: Tweet[];
}

export interface ApiResponse {
    ok: {
        data: Agent[];
        currentPage: number;
        totalPages: number;
        totalCount: number;
    };
    success: boolean;
}

export interface QuotaInfo {
    id: string;
    key: string;
    name: string;
    isActive: boolean;
    roles: string[];
    rateLimit: {
        requestsPerMonth: number;
        requestsPerMinute: number;
    };
    usage: {
        currentMonthRequests: number;
        lastUpdated: string;
    };
}

export interface QuotaResponse {
    ok: QuotaInfo[];
    success: boolean;
    error: null | string;
}
