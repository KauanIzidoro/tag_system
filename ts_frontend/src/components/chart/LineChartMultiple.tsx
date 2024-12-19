import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface RadialInfoProps {
    hour: number;
    authorized: number;
    rejected: number;
}

const chartConfig = {
    authorized: {
        label: "Autorizados",
        color: "#22c55e",  // Cor verde para autorizados
    },
    rejected: {
        label: "Rejeitados",
        color: "#ef4444",  // Cor vermelha para rejeitados
    },
} satisfies ChartConfig;

export function LineChartMultiple() {
    const [data, setData] = useState<RadialInfoProps[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Função para buscar os dados da API
    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:5267/api/Access/hourlyaccess", {
                headers: { Accept: "application/json" },
            });

            if (response.data && response.data.length > 0) {
                // Mapeia os dados para o formato esperado pelo gráfico
                const formattedData = response.data.map((item: any) => ({
                    hour: item.hour,
                    authorized: item.authorized,  // Contagem de acessos autorizados
                    rejected: item.rejected,      // Contagem de acessos rejeitados
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
        <Card>
            <CardHeader>
                <CardTitle>Acessos por hora</CardTitle>
                <CardDescription>Acessos autorizados e rejeitados nas últimas 24 horas.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="hour"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => `${value}:00`}  // Formato "hh:00"
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        {/* Linha para acessos autorizados */}
                        <Line
                            dataKey="authorized"
                            type="monotone"
                            stroke="#22c55e"  // Cor verde para autorizados
                            strokeWidth={2}
                            dot={false}
                        />
                        {/* Linha para acessos rejeitados */}
                        <Line
                            dataKey="rejected"
                            type="monotone"
                            stroke="#ef4444"  // Cor vermelha para rejeitados
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
