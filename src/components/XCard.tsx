import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart2, MessageCircle, Repeat2, Heart, Share } from "lucide-react";
import type { Tweet, XCardProps } from "@/types/api";

export function XCard({ tweets }: XCardProps) {
  console.log(tweets);
  return (
    <div className="grid grid-cols-3 gap-4 gap-y-5 gap-x-5">
      {tweets.map((tweet: Tweet, index: number) => (
        <Card
          key={index}
          className="w-full max-w-md bg-black border-gray-800 text-white overflow-hidden hover:bg-gray-900 transition-colors"
        >
          <CardContent className="pt-4">
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={tweet.tweetAuthorProfileImageUrl}
                  alt={tweet.tweetAuthorDisplayName}
                />
                <AvatarFallback>
                  {tweet.tweetAuthorDisplayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-200 truncate">
                    {tweet.tweetAuthorDisplayName}
                  </p>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5 fill-current text-gray-500"
                  >
                    <g>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </g>
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  @{tweet.tweetAuthorDisplayName.split(" ")[0].toLowerCase()}
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-300">
              {`This is where the tweet content would go. X API doesn't provide tweet content in this data.`}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 pb-2 text-gray-500">
            <button className="flex items-center space-x-1 hover:text-blue-400">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">0</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-green-400">
              <Repeat2 className="h-4 w-4" />
              <span className="text-xs">0</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-pink-400">
              <Heart className="h-4 w-4" />
              <span className="text-xs">0</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-400">
              <BarChart2 className="h-4 w-4" />
              <span className="text-xs">
                {tweet.impressionsCount.toLocaleString()}
              </span>
            </button>
            <button className="hover:text-blue-400">
              <Share className="h-4 w-4" />
            </button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
