'use client';

import { cookieApi } from '@/app/api/cookies';
import { useEffect, useState } from 'react';
import { MessageCircle, Repeat2, Heart, BarChart2, Share } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Tweet {
  authorUsername: string;
  createdAt: string;
  engagementsCount: number;
  impressionsCount: number;
  isQuote: boolean;
  isReply: boolean;
  likesCount: number;
  quotesCount: number;
  repliesCount: number;
  retweetsCount: number;
  smartEngagementPoints: number;
  text: string;
  matchingScore: number;
}

interface ApiResponse {
  ok: Tweet[];
  success: boolean;
  error: string | null;
}

export default function SearchExample() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchSearch = async (query: string, from: string, to: string) => {
    setLoading(true);
    try {
      const response: ApiResponse = await cookieApi.searchTweets(query, from, to);
      console.log('response', response)
      if (response.success && response.ok) {
        setTweets(response.ok);
        setHasSearched(true);
      } else {
        throw new Error(response.error || "Invalid response structure");
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch tweets",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearch('ava holo', '2025-01-01', '2025-01-20')
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-4 h-screen w-full bg-black/10 backdrop-blur-lg rounded-xl border dark:border-white/20 shadow-xl">
      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-red-500 py-4">Error: {error}</div>}
      {hasSearched && tweets.length === 0 && <div className="text-center py-4">No results found</div>}
      
      <div className="grid grid-cols-3 gap-2 gap-x-2 gap-y-2">
        {tweets.map((tweet, index) => (
          <Card
            key={index}
            className="w-full max-w-md bg-black border-gray-800 text-white overflow-hidden hover:bg-gray-900 transition-colors"
          >
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{tweet.authorUsername.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-200 truncate">
                      {tweet.authorUsername}
                    </p>
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current text-gray-500">
                      <g>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                      </g>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">@{tweet.authorUsername}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-300">{tweet.text}</p>
              {(tweet.isReply || tweet.isQuote || tweet.smartEngagementPoints > 0) && (
                <div className="mt-2 flex gap-2 text-xs">
                  {tweet.isReply && <span className="text-blue-400">Reply</span>}
                  {tweet.isQuote && <span className="text-green-400">Quote</span>}
                  {tweet.smartEngagementPoints > 0 && (
                    <span className="text-purple-400">
                      Smart Points: {tweet.smartEngagementPoints}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-2 pb-2 text-gray-500">
              <button className="flex items-center space-x-1 hover:text-blue-400">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{tweet.repliesCount}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-green-400">
                <Repeat2 className="h-4 w-4" />
                <span className="text-xs">{tweet.retweetsCount}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-pink-400">
                <Heart className="h-4 w-4" />
                <span className="text-xs">{tweet.likesCount}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-400">
                <BarChart2 className="h-4 w-4" />
                <span className="text-xs">{tweet.impressionsCount.toLocaleString()}</span>
              </button>
              <button className="hover:text-blue-400">
                <Share className="h-4 w-4" />
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}