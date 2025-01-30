// "use client"

// import { TrendingUp } from "lucide-react"
// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
// const chartData = [
//   { month: "January", desktop: 186 },
//   { month: "February", desktop: 305 },
//   { month: "March", desktop: 237 },
//   { month: "April", desktop: 73 },
//   { month: "May", desktop: 209 },
//   { month: "June", desktop: 214 },
// ]

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "hsl(var(--chart-1))",
//   },
// } satisfies ChartConfig

// export function RevenueGraph() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Bar Chart</CardTitle>
//         <CardDescription>January - June 2024</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <BarChart accessibilityLayer data={chartData}>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               tickFormatter={(value) => value.slice(0, 3)}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 font-medium leading-none">
//           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Showing total visitors for the last 6 months
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }


"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const allChartData = {
  week: [
    { period: "Mon", revenue: 30 },
    { period: "Tue", revenue: 45 },
    { period: "Wed", revenue: 55 },
    { period: "Thu", revenue: 40 },
    { period: "Fri", revenue: 60 },
    { period: "Sat", revenue: 35 },
    { period: "Sun", revenue: 25 },
  ],
  month: [
    { period: "W1", revenue: 186 },
    { period: "W2", revenue: 305 },
    { period: "W3", revenue: 237 },
    { period: "W4", revenue: 273 },
  ],
  year: [
    { period: "Jan", revenue: 186 },
    { period: "Feb", revenue: 305 },
    { period: "Mar", revenue: 237 },
    { period: "Apr", revenue: 73 },
    { period: "May", revenue: 209 },
    { period: "Jun", revenue: 214 },
    { period: "Jul", revenue: 250 },
    { period: "Aug", revenue: 280 },
    { period: "Sep", revenue: 220 },
    { period: "Oct", revenue: 230 },
    { period: "Nov", revenue: 210 },
    { period: "Dec", revenue: 190 },
  ],
}

const chartConfig = {
  desktop: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function RevenueGraph() {
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "year">("week")

  const chartData = useMemo(() => allChartData[timeFrame], [timeFrame])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Revenue overview</CardTitle>
            <CardDescription>Revenue overview for {timeFrame}</CardDescription>
          </div>
          <Select value={timeFrame} onValueChange={(value: "week" | "month" | "year") => setTimeFrame(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="revenue" fill="var(--primary)" radius={4} label={{ formatter: (value: number) => `$${value}` }} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this {timeFrame} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing total revenue for the selected {timeFrame}</div>
      </CardFooter>
    </Card>
  )
}