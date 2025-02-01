"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import XIcon from "./ui/general"

export type Agent = {
  agentName: string
  contracts: {
    chain: number
    contractAddress: string
  }[]
  twitterUsernames: string[]
  mindshare: number
  mindshareDeltaPercent: number
  marketCap: number
  marketCapDeltaPercent: number
  price: number
  priceDeltaPercent: number
  liquidity: number
  volume24Hours: number
  volume24HoursDeltaPercent: number
  holdersCount: number
  holdersCountDeltaPercent: number
  followersCount: number
  smartFollowersCount: number
  twitterProfileImage?: string
}

export const columns: ColumnDef<Agent>[] = [
  {
    accessorKey: "agentName",
    size: 250,
    header: ({ column }) => {
      return (
        <div className="text-center w-full">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
             Agent
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({ row, table }) => {
      // Get all rows and sort by volume to find top 3
      const allRows = table.getRowModel().rows
      const sortedByVolume = [...allRows].sort((a, b) => {
        const volumeA = a.getValue<number>("volume24Hours")
        const volumeB = b.getValue<number>("volume24Hours")
        return volumeB - volumeA
      })
      
      // Find current row's rank
      const currentRowRank = sortedByVolume.findIndex(
        (r) => r.id === row.id
      ) + 1

      // Determine which fire emoji to show (if any)
      let rankEmoji = ""
      if (currentRowRank === 1) rankEmoji = "🔥"
      else if (currentRowRank === 2) rankEmoji = "🔥"
      else if (currentRowRank === 3) rankEmoji = "🔥"

      return (
        <div className="flex items-center justify-center gap-2">
          <span className="font-medium">{row.getValue("agentName")}</span>
          {rankEmoji && <span className="ml-1">{rankEmoji}</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "price",
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
      )
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("price")
      const delta = row.original.priceDeltaPercent
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value)
      
      return (
        <div className="flex items-center justify-center gap-2">
          <div>{formatted}</div>
          <div className={`text-sm ${delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
            ({delta > 0 ? '+' : ''}{delta.toFixed(2)}%)
          </div>
        </div>
      )
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
      )
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("mindshare")
      const delta = row.original.mindshareDeltaPercent
      

      return (
        <div className="flex items-center justify-center gap-2 w-full">
            <div className={`flex items-center text-sm ${delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {delta > 0 ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <div>{value.toFixed(2)}</div>
          </div>
          
        </div>
      )
    },
  },
  {
    accessorKey: "marketCap",
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
      )
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("marketCap")
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
      }).format(value)
      
      return (
        <div className="flex items-center justify-center gap-2 w-full">
          <div>{formatted}</div>
        </div>
      )
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
      )
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("liquidity")
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
      }).format(value)
      
      return <div className="w-full text-center">{formatted}</div>
    },
  },
  {
    accessorKey: "volume24Hours",
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
      )
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("volume24Hours")
      const delta = row.original.volume24HoursDeltaPercent
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
      }).format(value)
      
      return (
        <div className="flex items-center justify-center gap-2 w-full">
          <div>{formatted}</div>
          <div className={`text-sm ${delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
            ({delta > 0 ? '+' : ''}{delta.toFixed(2)}%)
          </div>
        </div>
      )
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
      )
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("holdersCount")
      const delta = row.original.holdersCountDeltaPercent
      const formatted = new Intl.NumberFormat("en-US", {
        notation: "compact",
      }).format(value)
      
      return (
        <div className="flex items-center gap-2">
          <div>{formatted}</div>
          <div className={`text-sm ${delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
            ({delta > 0 ? '+' : ''}{delta.toFixed(2)}%)
          </div>
        </div>
      )
    },
  },

  {
    id: "twitter",
    cell: ({ row }) => {
      const username = row.original.twitterUsernames[0]
      if (!username) return <div>-</div>
      return (
        <a
          href={`https://twitter.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
            <XIcon width={24} height={24} />
        </a>
      )
    },
  },
//   {
//     accessorKey: "smartFollowersCount",
//     size: 150,
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Smart Followers
//           <ArrowUpDown className="ml-2 h-2 w-2" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => {
//       const value = row.getValue<number>("smartFollowersCount")
//       const formatted = new Intl.NumberFormat("en-US", {
//         notation: "compact",
//       }).format(value)
      
//       return <div>{formatted}</div>
//     },
//   },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const agent = row.original

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
              onClick={() => navigator.clipboard.writeText(agent.contracts[0].contractAddress)}
            >
              Copy contract address
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            {agent.twitterUsernames[0] && (
              <DropdownMenuItem
                onClick={() => window.open(`https://twitter.com/${agent.twitterUsernames[0]}`, '_blank')}
              >
                View Twitter
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function AgentDashboard({ 
  data, 
  pagination,
  loading,
  error,
  onPageChange 
}: { 
  data: Agent[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
  }
  loading?: boolean
  error?: string | null
  onPageChange: (page: number) => void
}) {
    console.log(data);
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "volume24Hours",
      desc: true
    }
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

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
          desc: true
        }
      ]
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("agentName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("agentName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
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
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} total items)
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
            disabled={pagination.currentPage >= pagination.totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AgentDashboard;