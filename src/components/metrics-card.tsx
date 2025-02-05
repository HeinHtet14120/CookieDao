import { Card } from "@/components/ui/card"
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react"
import type React from "react" // Added import for React

interface MetricsCardProps {
  title: string
  value: string
  change: {
    value: string
    percentage: string
    isPositive: boolean
  }
  chart?: React.ReactNode
}

export function MetricsCard({ title, value, change, chart }: MetricsCardProps) {
  return (
    <Card className="p-4 bg-[#1E2329] text-white border-none">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        {chart ? <ArrowUpRight className="h-4 w-4 text-gray-400" /> : null}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center gap-2 mt-2">
            {change.isPositive ? (
              <TrendingUp className="h-4 w-4 text-[#F0B90B]" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm font-medium text-gray-300">{change.value}</span>
            <span className={`text-sm font-medium ${change.isPositive ? "text-[#F0B90B]" : "text-red-500"}`}>
              {change.percentage}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">{chart}</div>
      </div>
    </Card>
  )
}

