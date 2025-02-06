import { BentoGridItem, BentoGrid } from "./ui/bento-grid";
import { IconBrandX } from "@tabler/icons-react";
import Image from "next/image";

export function TopTweet({
  tweets,
}: {
  tweets: Array<{
    tweetUrl: string;
    tweetAuthorProfileImageUrl: string;
    tweetAuthorDisplayName: string;
    smartEngagementPoints: number;
    impressionsCount: number;
  }>;
}) {
  console.log("this is the tweets", tweets);
  return (
    <BentoGrid className="max-w-max mx-auto">
      {tweets.map((tweet, i) => (
        <BentoGridItem
          key={i}
          title={tweet.tweetAuthorDisplayName}
          description={`${tweet.smartEngagementPoints} engagement points · ${tweet.impressionsCount.toLocaleString()} impressions`}
          header={
            <Image
              src={tweet.tweetAuthorProfileImageUrl.replace("_normal", "")}
              alt={tweet.tweetAuthorDisplayName}
              className="rounded-full h-10 w-10 object-cover"
            />
          }
          icon={<IconBrandX className="h-4 w-4 text-neutral-500" />}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}
