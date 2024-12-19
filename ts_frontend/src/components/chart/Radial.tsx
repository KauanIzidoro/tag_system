import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Clock } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface RadialInfoProps {
  hour: string;
  accessCount: number;
}

const chartConfig = {
  acess: {
    label: "Acessos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Radial() {
  const [data, setData] = useState<RadialInfoProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5267/api/Access/hourlyaccess", {
        headers: { Accept: "application/json" },
      });

      if (response.data && response.data.length > 0) {
        // Formatar os dados antes de setar no estado
        // Mapeando os dados para o formato esperado pelo gráfico
        const formattedData = response.data.map((item: any) => ({
          hour: `${item.hour}:00`,  // Formato "hh:00"
          acess: item.accessCount,   // Contagem de acessos
        }));
        setData(formattedData);
      } else {
        setData([]);
        setError("Nenhum dado encontrado.");
      }
    } catch (error: any) {
      setError(error.response?.data || "Erro ao carregar dados.");
      setData([]);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle>Por hora</CardTitle>
          <Clock className="ml-auto w-6 h-6" />
        </div>
        <CardDescription>Registro de acessos por tag no período de 24h</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={data}  // Usando os dados formatados
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"  // Usando "hour" como chave para os dados
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)}  // Exibe a hora no formato "hh:00"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="acess"  // Usando "acess" para mostrar a contagem de acessos
              type="natural"
              stroke="var(--color-acess)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-acess)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
