"use client";

import * as React from "react";
import { IconBrandX } from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Link,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import XIcon from "./ui/general";
import CoinAvatar from "./CoinAvatar";
import { useState, useEffect } from "react";
import { debounce } from "@/lib/debounce";
import CoinInfo from "./CoinInfo";
import { Progress } from "@/components/ui/progress";

export type Agent = {
  agentName: string;
  contracts: {
    chain: number;
    contractAddress: string;
  }[];
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
  followersCount: number;
  smartFollowersCount: number;
  twitterProfileImage?: string;
};

export const columns: ColumnDef<Agent>[] = [
  {
    accessorKey: "agentName",
    size: 250,
    enableHiding: false,
    header: ({ column }) => {
      return (
        <div className="text-center w-full">
          <Button
            className=" hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Agent
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      );
    },
    cell: ({ row, table }) => {
      // Get all rows and sort by volume to find top 3
      const allRows = table.getRowModel().rows;
      const sortedByVolume = [...allRows].sort((a, b) => {
        const volumeA = a.getValue<number>("volume24Hours");
        const volumeB = b.getValue<number>("volume24Hours");
        return volumeB - volumeA;
      });

      // Find current row's rank
      const currentRowRank =
        sortedByVolume.findIndex((r) => r.id === row.id) + 1;

      // Determine which fire emoji to show (if any)
      let rankEmoji = "";
      if (currentRowRank === 1) rankEmoji = "🔥";
      else if (currentRowRank === 2) rankEmoji = "🔥";
      else if (currentRowRank === 3) rankEmoji = "🔥";

      return (
        <div className="flex items-center justify-left gap-3">
          <CoinAvatar
            contractAddress={row.original?.contracts?.[0]?.contractAddress}
            chain={row.original?.contracts?.[0]?.chain}
          />
          <div className="flex">
            <span className="font-medium">{row.getValue("agentName")}</span>
            {rankEmoji && <span className="ml-1">{rankEmoji}</span>}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full text-center hover:bg-transparent"
        >
          Price
          <ArrowUpDown className="ml-2 h-2 w-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("price");
      const delta = row.original.priceDeltaPercent;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);

      return (
        <div className="flex items-center justify-center gap-2">
          <div>{formatted}</div>
          <div
            className={`text-sm ${delta > 0 ? "text-green-600" : "text-red-600"}`}
          >
            ({delta > 0 ? "+" : ""}
            {delta?.toFixed(2)}%)
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "mindshare",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full text-center hover:bg-transparent"
        >
          Mindshare
          <ArrowUpDown className="ml-2 h-2 w-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original?.mindshare ?? null;
      const delta = row.original?.mindshareDeltaPercent ?? 0;

      // Handle null/undefined cases
      if (value === null || typeof value === "undefined") {
        return <div className="text-center">-</div>;
      }

      return (
        <div className="flex items-center justify-center gap-2 w-full">
          <div
            className={`flex items-center text-sm ${delta > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {delta > 0 ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {/* Safe number formatting */}
            {typeof value === "number" ? value.toFixed(2) : "-"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "marketCap",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full text-center hover:bg-transparent"
        >
          Market Cap
          <ArrowUpDown className="ml-2 h-2 w-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("marketCap");
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
      }).format(value);

      return (
        <div className="flex items-center justify-center gap-2 w-full">
          <div>{formatted}</div>
        </div>
      );
    },
  },

  {
    accessorKey: "liquidity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full text-center hover:bg-transparent"
        >
          Liquidity
          <ArrowUpDown className="ml-2 h-2 w-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("liquidity");
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
      }).format(value);

      return <div className="w-full text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "volume24Hours",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full text-center hover:bg-transparent"
        >
          24h Volume
          <ArrowUpDown className="ml-2 h-2 w-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("volume24Hours");
      const delta = row.original.volume24HoursDeltaPercent;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
      }).format(value);

      return (
        <div className="flex items-center justify-center gap-2 w-full">
          <div>{formatted}</div>
          <div
            className={`text-sm ${delta > 0 ? "text-green-600" : "text-red-600"}`}
          >
            ({delta > 0 ? "+" : ""}
            {delta.toFixed(2)}%)
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "holdersCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Holders
          <ArrowUpDown className="ml-2 h-2 w-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("holdersCount");
      const delta = row.original.holdersCountDeltaPercent;
      const formatted = new Intl.NumberFormat("en-US", {
        notation: "compact",
      }).format(value);

      return (
        <div className="flex items-center gap-2">
          <div>{formatted}</div>
          <div
            className={`text-sm ${delta > 0 ? "text-green-600" : "text-red-600"}`}
          >
            ({delta > 0 ? "+" : ""}
            {delta.toFixed(2)}%)
          </div>
        </div>
      );
    },
  },

  {
    id: "twitter",
    cell: ({ row }) => {
      const username = row.original.twitterUsernames[0];
      if (!username) return <div>-</div>;
      return (
        <a
          href={`https://twitter.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className=" hover:underline"
        >
          <IconBrandX fill="white" className="h-full w-full text-neutral-300" />
        </a>
      );
    },
  },
  {
    accessorKey: "smartFollowersCount",
    size: 150,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          SF Count
          <ArrowUpDown className="ml-2 h-2 w-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("smartFollowersCount");
      const formatted = new Intl.NumberFormat("en-US", {
        notation: "compact",
      }).format(value);

      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const agent = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(
                  agent.contracts[0].contractAddress,
                )
              }
            >
              Copy contract address
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            {agent.twitterUsernames[0] && (
              <DropdownMenuItem
                onClick={() =>
                  window.open(
                    `https://twitter.com/${agent.twitterUsernames[0]}`,
                    "_blank",
                  )
                }
              >
                View Twitter
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface AgentDashboardProps {
  data: Agent[];
  aiPredictions: { [key: string]: string }; // ✅ Ensure AI Predictions is passed here
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
  loading?: boolean;
  error?: string | null;
  onPageChange: (page: number) => void;
  onSearch?: (query: string, type: "contract" | "twitter") => void;
}

export function AgentDashboard({
  data,
  pagination,
  loading,
  error,
  onPageChange,
  aiPredictions,
  onSearch,
}: AgentDashboardProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "volume24Hours",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      mindshare: false,
      smartFollowersCount: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchType, setSearchType] = useState<"contract" | "twitter">(
    "contract",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [progress, setProgress] = useState(0);

  const columns: ColumnDef<Agent>[] = [
    {
      accessorKey: "agentName",
      size: 250,
      enableHiding: false,
      header: ({ column }) => {
        return (
          <div className="text-center w-full">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Agent
              <ArrowUpDown className="ml-1 h-2 w-2" />
            </Button>
          </div>
        );
      },
      cell: ({ row, table }) => {
        // Get all rows and sort by volume to find top 3
        const allRows = table.getRowModel().rows;
        const sortedByVolume = [...allRows].sort((a, b) => {
          const volumeA = a.getValue<number>("volume24Hours");
          const volumeB = b.getValue<number>("volume24Hours");
          return volumeB - volumeA;
        });

        // Find current row's rank
        const currentRowRank =
          sortedByVolume.findIndex((r) => r.id === row.id) + 1;

        // Determine which fire emoji to show (if any)
        let rankEmoji = "";
        if (currentRowRank === 1) rankEmoji = "🔥";
        else if (currentRowRank === 2) rankEmoji = "🔥";
        else if (currentRowRank === 3) rankEmoji = "🔥";

        return (
          <div className="flex items-center justify-left gap-3">
            <CoinAvatar
              contractAddress={row.original?.contracts?.[0]?.contractAddress}
              chain={row.original?.contracts?.[0]?.chain}
            />
            <div className="flex">
              <span className="font-medium text-white/50">{row.getValue("agentName")}</span>
              {rankEmoji && <span className="ml-1">{rankEmoji}</span>}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      enableHiding: false,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full text-center"
          >
            Price
            <ArrowUpDown className="ml-2 h-2 w-2" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue<number>("price");
        const delta = row.original.priceDeltaPercent;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);

        return (
          <div className="flex items-center justify-center gap-2">
            <div className="text-white/50">{formatted}</div>
            <div
              className={`text-sm ${delta > 0 ? "text-green-600" : "text-red-600"}`}
            >
              ({delta > 0 ? "+" : ""}
              {delta?.toFixed(2)}%)
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "mindshare",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full text-center"
          >
            Mindshare
            <ArrowUpDown className="ml-2 h-2 w-2" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.original?.mindshare ?? null;
        const delta = row.original?.mindshareDeltaPercent ?? 0;

        // Handle null/undefined cases
        if (value === null || typeof value === "undefined") {
          return <div className="text-center">-</div>;
        }

        return (
          <div className="flex items-center justify-center gap-2 w-full">
            <div
              className={`flex items-center text-sm ${delta > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {delta > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {/* Safe number formatting */}
              {typeof value === "number" ? value.toFixed(2) : "-"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "marketCap",
      enableHiding: false,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full text-center"
          >
            Market Cap
            <ArrowUpDown className="ml-2 h-2 w-2" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue<number>("marketCap");
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
        }).format(value);

        return (
          <div className="flex items-center justify-center gap-2 w-full">
            <div className="text-white/50">{formatted}</div>
          </div>
        );
      },
    },

    {
      accessorKey: "liquidity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full text-center"
          >
            Liquidity
            <ArrowUpDown className="ml-2 h-2 w-2" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue<number>("liquidity");
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
        }).format(value);

        return <div className="w-full text-center text-white/50">{formatted}</div>;
      },
    },
    {
      accessorKey: "volume24Hours",
      enableHiding: false,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full text-center"
          >
            24h Volume
            <ArrowUpDown className="ml-2 h-2 w-2" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue<number>("volume24Hours");
        const delta = row.original.volume24HoursDeltaPercent;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
        }).format(value);

        return (
          <div className="flex items-center justify-center gap-2 w-full">
            <div className="text-white/50">{formatted}</div>
            <div
              className={`text-sm ${delta > 0 ? "text-green-600" : "text-red-600"}`}
            >
              ({delta > 0 ? "+" : ""}
              {delta.toFixed(2)}%)
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "holdersCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Holders
            <ArrowUpDown className="ml-2 h-2 w-2" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue<number>("holdersCount");
        const delta = row.original.holdersCountDeltaPercent;
        const formatted = new Intl.NumberFormat("en-US", {
          notation: "compact",
        }).format(value);

        return (
          <div className="flex items-center gap-2">
            <div className="text-white/50">{formatted}</div>
            <div
              className={`text-sm ${delta > 0 ? "text-green-600" : "text-red-600"}`}
            >
              ({delta > 0 ? "+" : ""}
              {delta.toFixed(2)}%)
            </div>
          </div>
        );
      },
    },

    {
      id: "twitter",
      cell: ({ row }) => {
        const username = row.original.twitterUsernames[0];
        if (!username) return <div>-</div>;
        return (
          <a
            href={`https://twitter.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:underline"
          >
            <IconBrandX fill="white/50" className="h-4 w-4" />
          </a>
        );
      },
    },
    {
      accessorKey: "smartFollowersCount",
      size: 150,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            SF Count
            <ArrowUpDown className="ml-2 h-2 w-2" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue<number>("smartFollowersCount");
        const formatted = new Intl.NumberFormat("en-US", {
          notation: "compact",
        }).format(value);

        return <div className="text-white/50">{formatted}</div>;
      },
    },
    {
      id: "aiPrediction",
      header: "AI Suggestion",
      cell: ({ row }) => {
        const agentName = row.original.agentName;
        const prediction = aiPredictions[agentName] || "No Data";

        return (
          <div
            className={`text-sm px-2 py-1 rounded ${
              prediction === "Increase allocation"
                ? "bg-green-300 text-green-800"
                : prediction === "Reduce allocation"
                  ? "bg-red-300 text-red-800"
                  : "bg-gray-200"
            }`}
          >
            {prediction}
          </div>
        );
      },
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const agent = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    agent.contracts[0].contractAddress,
                  )
                }
              >
                Copy contract address
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              {agent.twitterUsernames[0] && (
                <DropdownMenuItem
                  onClick={() =>
                    window.open(
                      `https://twitter.com/${agent.twitterUsernames[0]}`,
                      "_blank",
                    )
                  }
                >
                  View Twitter
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      sorting: [
        {
          id: "volume24Hours",
          desc: true,
        },
      ],
      pagination: {
        pageSize: 20,
      },
      columnVisibility: {
        mindshare: false,
        smartFollowersCount: false,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    if (!loading) return;

    // Reset progress when loading starts
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [loading]);

  const handlePreviousPage = () => {
    if (pagination.currentPage > 1 && !loading) {
      onPageChange(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages && !loading) {
      onPageChange(pagination.currentPage + 1);
    }
  };

  const handleSearch = debounce(
    (query: string, type: "contract" | "twitter") => {
      console.log("searchQuery", query);
      if (query && onSearch) {
        onSearch(query, type);
      }
    },
    500,
  );

  if (loading)
    return (
      <div className="w-full h-[100vh] flex items-center justify-center flex-col gap-4">
        <Progress value={progress} className="w-[15%] h-1" />
        <div className="text-sm text-muted-foreground">
          Loading agent data...
        </div>
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          className="max-w-md focus-visible:ring-0 text-white/50 focus-visible:ring-offset-0 bg-white/10 backdrop-blur-lg border border-white/20"
          placeholder={`Search by ${searchType === "contract" ? "contract address" : "Twitter username"}...`}
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value;
            setSearchQuery(value);

            // Auto-detect input type
            if (/^[A-Za-z0-9]{32,44}$/.test(value)) {
              setSearchType("contract");
            } else if (value.startsWith("@")) {
              setSearchType("twitter");
              setSearchQuery(value.replace("@", ""));
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchQuery, searchType);
              setSearchQuery("");
            }
          }}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto border border-white/20 backdrop-blur-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              Fields <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border overflow-x-auto relative border-none backdrop-blur-lg border-top-1 border-white/20">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        <Table className="w-full">
          <TableHeader className="bg-black/80 border-none backdrop-blur-lg">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-black/50 backdrop-blur-lg border-b border-white/20">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="[&_td]:py-1"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-center border-b border-white/20 text-sm"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-white/50 backdrop-blur-lg border border-white/20">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {data.length > 1 && (
        <div className="flex items-center justify-end space-x-2 bg-black/100 border-none mt-4 mb-4 backdrop-blur-lg rounded-xl border shadow-xl">
          <div className="flex-1 text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages} (
            {pagination.totalCount} total items)
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={pagination.currentPage <= 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={
                pagination.currentPage >= pagination.totalPages || loading
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {data[0] === undefined && (
        <div className="flex items-center justify-center py-4">
          <div className="text-sm text-muted-foreground">No results.</div>
          <div className="text-sm text-muted-foreground">
            <Link href="/dashboard">
              <Button>Back to dashboard</Button>
            </Link>
          </div>
        </div>
      )}
      {data.length === 1 && data[0] && <CoinInfo data={data[0]} />}
    </div>
  );
}

export default AgentDashboard;
