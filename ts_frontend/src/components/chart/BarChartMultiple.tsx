import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"

// Tipo dos dados recebidos da API
interface BarChartMultipleInfoProps {
  day: string;
  authorized: number;
  rejected: number;
}

// Definindo a configuração para o gráfico
const chartConfig = {
  rejected: {
    label: "Negados",
    color: "hsl(var(--chart-1))",
  },
  authorized: {
    label: "Aprovados",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function BarChartMultiple() {
  const [data, setData] = useState<BarChartMultipleInfoProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5267/api/Access/weeklyaccess", {
        headers: { Accept: "application/json" },
      });

      if (response.data && response.data.length > 0) {
        // Formatar os dados antes de setar no estado
        setData(response.data);
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

  // Função para formatar o dia da semana
  const formatDayOfWeek = (date: string) => {
    // Definindo a ordem dos dias da semana corretamente, com "Seg" como o primeiro dia
    const daysOfWeek = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

    // Desconstruir a data no formato yyyy-mm-dd
    const [year, month, day] = date.split("-").map(Number);

    // Usar Date.UTC para garantir o cálculo correto em UTC
    const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getDay();  // Obtém o número do dia da semana (0 a 6)

    // Retorna o nome do dia da semana de acordo com o índice
    return daysOfWeek[dayOfWeek];
  };

  // // Função para formatar a data no formato "07 de Dezembro"
  // const formatDateForDisplay = (date: string) => {
  //   const months = [
  //     "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  //   ];
  //   const [year, month, day] = date.split("-").map(Number);
  //   const monthName = months[month - 1];
  //   return `${String(day).padStart(2, '0')} de ${monthName}`;
  // };

  // // Mapeando os dados para adicionar a data formatada sem alterar a original
  // const formattedData = data.map((item) => ({
  //   ...item,
  //   formattedDay: formatDateForDisplay(item.day),  // Chave nova com a data formatada
  // }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acessos semanais</CardTitle>
        <CardDescription>Número de acessos diários nos últimos 7 dias.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"  // Aqui usamos "day" como chave para os dias
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => formatDayOfWeek(value)} // Formata para o nome do dia da semana
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="rejected" fill="#ef4444" radius={4} />
            <Bar dataKey="authorized" fill="#22c55e" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
