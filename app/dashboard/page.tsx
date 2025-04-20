"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Excuse } from "@/types/excuse"
import { formatDistanceToNow } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ArrowRight, BarChart2, Clock, Sparkles, ThumbsUp } from "lucide-react"

export default function DashboardPage() {
  const [excuses, setExcuses] = useState<Excuse[]>([])
  const [stats, setStats] = useState({
    total: 0,
    mostUsed: null as Excuse | null,
    recentExcuses: [] as Excuse[],
    usageData: [] as { name: string; value: number }[],
  })

  useEffect(() => {
    // In a real app, this would be an API call
    const storedExcuses: Excuse[] = JSON.parse(localStorage.getItem("excuses") || "[]")
    setExcuses(storedExcuses)

    // Calculate stats
    const total = storedExcuses.length
    const sortedByUsage = [...storedExcuses].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    const mostUsed = sortedByUsage.length > 0 ? sortedByUsage[0] : null
    const recentExcuses = [...storedExcuses]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    // Prepare chart data
    const usageData = sortedByUsage.slice(0, 5).map((excuse) => ({
      name: excuse.situation.length > 15 ? excuse.situation.substring(0, 15) + "..." : excuse.situation,
      value: excuse.usageCount || 0,
    }))

    setStats({ total, mostUsed, recentExcuses, usageData })
  }, [])

  return (
    <div className="container py-6 md:py-12 px-4 md:px-6">
      <h1 className="mb-6 md:mb-8 text-2xl md:text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
            <CardTitle className="text-sm font-medium">Total Excuses</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Excuses generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {stats.mostUsed ? (
              <>
                <div className="text-2xl font-bold">{stats.mostUsed.usageCount || 0}</div>
                <p className="text-xs text-muted-foreground line-clamp-1">{stats.mostUsed.situation}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No excuses used yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
            <CardTitle className="text-sm font-medium">Saturation</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round(((stats.mostUsed?.usageCount || 0) / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Most used vs total</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 md:mt-8 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-1">
          <CardHeader className="p-4">
            <CardTitle className="text-lg md:text-xl">Usage Statistics</CardTitle>
            <CardDescription>Top 5 most used excuses</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {stats.usageData.length > 0 ? (
              <ChartContainer
                config={{
                  value: {
                    label: "Usage Count",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-60 md:h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.usageData} layout="vertical" margin={{ left: 40 }}>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex h-60 md:h-80 items-center justify-center">
                <p className="text-muted-foreground">No usage data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <div>
              <CardTitle className="text-lg md:text-xl">Recent Excuses</CardTitle>
              <CardDescription>Your latest generated excuses</CardDescription>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {stats.recentExcuses.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {stats.recentExcuses.map((excuse) => (
                  <Link
                    key={excuse.id}
                    href={`/excuses/${excuse.id}`}
                    className="flex flex-col space-y-1 rounded-md p-2 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium line-clamp-1 text-sm md:text-base">{excuse.situation}</span>
                      <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0 ml-2" />
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(excuse.createdAt)} ago</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex h-60 md:h-80 items-center justify-center">
                <p className="text-muted-foreground">No excuses generated yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
