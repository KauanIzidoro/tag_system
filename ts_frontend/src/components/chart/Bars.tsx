"use client"


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React, { useState, useEffect, useCallback } from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tag } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import axios from 'axios';

export const description = "A bar chart"

const chartData = [
  { day: "Segunda", acess: 186 },
  { day: "Terça", acess: 305 },
  { day: "Quarta", acess: 237 },
  { day: "Quinta", acess: 73 },
  { day: "Sexta", acess: 209 },
  { day: "Sábado", acess: 214 },
]

const chartConfig = {
  acess: {
    label: "Acessos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Bars() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle>Acessos semanais</CardTitle>
          <Tag className="ml-auto w-6 h-6" />
        </div>
        <CardDescription>Número de acessos diários nos últimos 7 dias.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="acess" fill="var(--color-acess)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}