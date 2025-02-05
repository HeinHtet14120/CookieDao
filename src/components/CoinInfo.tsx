import { Agent } from "@/types/api";
import { TrendingUp, TrendingDown, Link as LinkIcon, Link } from "lucide-react";
import { CardTitle, Card } from "@/components/ui/card-hover-effect";
import { FloatingDock } from "./ui/floating-dock";
import { IconBrandX, IconTerminal2 } from "@tabler/icons-react";
import { CardContent, CardHeader } from "./ui/card";
import { XCard } from "./XCard";

// Helper formatting functions
const formatCurrency = (value?: number) =>
  value
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(value)
    : "-";

const formatPercentage = (value?: number) =>
  value ? `${value > 0 ? "+" : " "}${value.toFixed(2)}%` : " - ";

// Reusable data row component
const DataRow = ({
  label,
  value,
  delta,
  link,
}: {
  label: string;
  value: React.ReactNode;
  delta?: number;
  link?: string;
}) => (
  <div className="flex justify-between items-center gap-5 py-1.5 px-2">
    <span className=" text-muted-foreground/90 text-sm">{label}</span>
    <div className="flex items-center justify-between gap-5">
      {link ? (
        <Link
          to={link}
          target="_blank"
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          {value}
          <LinkIcon className="h-3 w-3" />
        </Link>
      ) : (
        <span className="font-medium text-white/80 text-sm">{value}</span>
      )}
      {delta !== undefined && (
        <span
          className={`text-xs ${delta > 0 ? "text-green-600" : "text-red-600"}`}
        >
          {delta > 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {formatPercentage(delta)}
        </span>
      )}
    </div>
  </div>
);

const CoinInfo = ({ data }: { data: Agent }) => {
  const links = [
    {
      title: "CA",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-300" />
      ),
      ca: data.contracts?.[0]?.contractAddress,
    },
    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-300" />
      ),
      href: `https://twitter.com/${data.twitterUsernames?.[0]}`,
    },
  ];

  if (!data) return null;

  // const tweets = data.topTweets?.map(tweet => ({
  //   impressionsCount: tweet.impressions,
  //   smartEngagementPoints: tweet.engagements,
  //   tweetAuthorDisplayName: data.twitterUsernames?.[0],
  //   tweetAuthorProfileImageUrl: data.u,
  //   tweetUrl: tweet.url
  // })) || [];

  return (
    <div className="flex items-center my-auto justify-between min-h-full w-[100%] mt-10 gap-10">
      <div className="flex w-[20%] flex-col gap-2 border border-white/20 backdrop-blur-lg rounded-xl">
        {/* Core Metrics Card */}
        <Card className="h-fit w-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between gap-2">
              <div>{data.agentName}</div>
              <div className="flex items-center gap-2 rounded-md p-1">
                <span>
                  {data.priceDeltaPercent > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                </span>
                <span
                  className={`text-sm ${data.priceDeltaPercent > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatPercentage(data.priceDeltaPercent)}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <DataRow label="Price" value={formatCurrency(data.price)} />
            <DataRow
              label="Market Cap"
              value={formatCurrency(data.marketCap)}
            />
            <DataRow
              label="24h Volume"
              value={formatCurrency(data.volume24Hours)}
            />
            <DataRow label="Liquidity" value={formatCurrency(data.liquidity)} />
          </CardContent>
        </Card>
        <FloatingDock items={links} />

        {/* <Button variant="outline" className="w-fit h-fit text-xs">
          {data.contracts?.map((contract, index) => (
            <div key={index}>{contract.contractAddress}</div>
          ))}
        </Button> */}
      </div>
      <div className=" w-[80%] ">
        <XCard tweets={data.topTweets || []} />
      </div>
      {/* Social & Community Card */}
      {/* <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Community</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {data.twitterUsernames?.map((username, index) => (
            <DataRow
              key={index}
              label="Twitter"
              value={`@${username}`}
              link={`https://twitter.com/${username}`}
            />
          ))}
          <DataRow label="Followers" value={formatNumber(data.followersCount)} />
          <DataRow label="Smart Followers" value={formatNumber(data.smartFollowersCount)} />
          <DataRow 
            label="Mindshare" 
            value={data.mindshare?.toFixed(2)} 
            delta={data.mindshareDeltaPercent} 
          />
        </CardContent>
      </Card> */}

      {/* Blockchain Data Card */}
      {/* <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Blockchain</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {data.contracts?.map((contract, index) => (
            <DataRow
              key={index}
              label={`Chain ${contract.chain}`}
              value={
                <span className="font-mono">
                  {contract.contractAddress.slice(0, 6)}...{contract.contractAddress.slice(-4)}
                </span>
              }
              link={`https://explorer/address/${contract.contractAddress}`} // Replace with actual chain explorer
            />
          ))}
          <DataRow label="Holders" value={formatNumber(data.holdersCount)} delta={data.holdersCountDeltaPercent} />
          <DataRow label="Total Supply" value={formatNumber(data.totalSupply)} />
        </CardContent>
      </Card> */}

      {/* Engagement Metrics Card */}
      {/* {(data.averageImpressionsCount || data.averageEngagementsCount) && (
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <DataRow
                label="Avg Impressions"
                value={formatNumber(data.averageImpressionsCount)}
                delta={data.averageImpressionsCountDeltaPercent}
              />
              <DataRow
                label="Avg Engagements"
                value={formatNumber(data.averageEngagementsCount)}
                delta={data.averageEngagementsCountDeltaPercent}
              />
            </div>
            {data.topTweets && data.topTweets.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Top Performing Tweets</h4>
                {data.topTweets.map((tweet, index) => (
                  <DataRow
                    key={index}
                    label={`Tweet ${index + 1}`}
                    value={`${formatNumber(tweet.impressions)} impressions`}
                    link={tweet.url}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )} */}

      {/* Extended Financial Metrics Card */}
      {/* <Card className="lg:col-span-3">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Advanced Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DataRow label="Price/Volume Ratio" value={data.priceVolumeRatio?.toFixed(2)} />
          <DataRow label="Volatility (7D)" value={formatPercentage(data.volatility7D)} />
          <DataRow label="TVL" value={formatCurrency(data.totalValueLocked)} />
          <DataRow label="Circulating Supply" value={formatNumber(data.circulatingSupply)} />
        </CardContent>
      </Card> */}
    </div>
  );
};

export default CoinInfo;
