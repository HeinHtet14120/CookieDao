"use client"

import { cookieApi } from "@/app/api/cookies"
import { useState } from "react"
import { MessageCircle, Repeat2, Heart, BarChart2, Share, Search } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface Tweet {
  authorUsername: string
  createdAt: string
  engagementsCount: number
  impressionsCount: number
  isQuote: boolean
  isReply: boolean
  likesCount: number
  quotesCount: number
  repliesCount: number
  retweetsCount: number
  smartEngagementPoints: number
  text: string
  matchingScore: number
}

interface ApiResponse {
  ok: Tweet[]
  success: boolean
  error: string | null
}

export default function SearchExample() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [query, setQuery] = useState("ava holo")
  const [fromDate, setFromDate] = useState("2025-01-01")
  const [toDate, setToDate] = useState("2025-01-20")

  const fetchSearch = async (searchQuery: string, from: string, to: string) => {
    setLoading(true)
    try {
      const response: ApiResponse = await cookieApi.searchTweets(searchQuery, from, to)
      if (response.success && response.ok) {
        setTweets(response.ok)
        setHasSearched(true)
      } else {
        throw new Error(response.error || "Invalid response structure")
      }
    } catch (error) {
      console.error("Error fetching tweets:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch tweets")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchSearch(query, fromDate, toDate)
  }

  const handleSearchClick = () => {
    fetchSearch(query, fromDate, toDate)
  }

  // useEffect(() => {
  //   fetchSearch(query, fromDate, toDate)
  // }, [query, fromDate, toDate]) // Added dependencies to useEffect

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="p-4 h-screen w-full bg-black/10 backdrop-blur-lg overflow-y-auto rounded-xl border border-black shadow-xl">
      <form onSubmit={handleSearch} className="max-w-4xl mx-auto p-6 bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-800/50 mb-8">
        <div className="flex flex-col space-y-6">
          {/* Search Query Input */}
          <div className="relative">
            <Label htmlFor="query" className="text-gray-300 text-sm font-medium mb-2 block">
              Search Query
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                id="query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full bg-gray-800/50 text-white border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your search query..."
              />
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fromDate" className="text-gray-300 text-sm font-medium block">
                From Date
              </Label>
              <div className="relative">
                <Input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full bg-gray-800/50 text-white border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toDate" className="text-gray-300 text-sm font-medium block">
                To Date
              </Label>
              <div className="relative">
                <Input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full bg-gray-800/50 text-white border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <Button 
            onClick={handleSearchClick} 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>
      </form>

      {loading && <div className="text-center py-4 text-white">Loading...</div>}
      {error && <div className="text-red-500 py-4">Error: {error}</div>}
      {hasSearched && tweets.length === 0 && <div className="text-center py-4 text-white">No results found</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tweets.map((tweet, index) => (
          <Card
            key={index}
            className="w-full bg-black border-gray-800 text-white overflow-hidden hover:bg-gray-900 transition-colors"
          >
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-200 truncate">{tweet.authorUsername}</p>
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current text-gray-500">
                      <g>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                      </g>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">@{tweet.authorUsername}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-300 truncate">{tweet.text}</p>
              {(tweet.isReply || tweet.isQuote || tweet.smartEngagementPoints > 0) && (
                <div className="mt-2 flex gap-2 text-xs">
                  {tweet.isReply && <span className="text-blue-400">Reply</span>}
                  {tweet.isQuote && <span className="text-green-400">Quote</span>}
                  {tweet.smartEngagementPoints > 0 && (
                    <span className="text-purple-400">Smart Points: {tweet.smartEngagementPoints}</span>
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
  )
}

