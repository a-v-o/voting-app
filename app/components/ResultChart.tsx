"use client";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Chart } from "@/utils/types";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

const chartConfig = {
  votes: {
    label: "Votes",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function ResultChart({ chartData }: { chartData: Chart[] }) {
  return (
    <div className="p-8">
      {chartData.map((chart) => {
        const key = Object.keys(chart)[0];
        return (
          chart[key].length != 0 && (
            <div className="flex flex-col items-center p-4">
              <h1 className="mb-4">{key}</h1>
              <ChartContainer
                key={key}
                config={chartConfig}
                className="min-h-[200px] w-full min-w-[480px]"
              >
                <BarChart
                  accessibilityLayer
                  data={chart[key]}
                  layout="vertical"
                >
                  <CartesianGrid />
                  <YAxis dataKey="name" type="category" />
                  <XAxis
                    type="number"
                    tickLine={false}
                    tickMargin={10}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />

                  <Bar
                    dataKey="votes"
                    fill="var(--color-votes)"
                    radius={4}
                    barSize={30}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          )
        );
      })}
    </div>
  );
}
