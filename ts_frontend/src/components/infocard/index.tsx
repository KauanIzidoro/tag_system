import { Card, CardContent, CardHeader } from "../ui/card";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { InfoCardIcon } from "./InfoCardIcon";
import { InfoCardTitle } from "./InfoCardTitle";

interface CardInformations {
  titulo: string;
  subtitulo?: string;
  prop?: string;
  icone: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface AccessInfo {
  dailyaccess?: number;
  total?: number;
  rejected?: number;
  latest?: string;
}

export default function InfoCard({ titulo, subtitulo, prop, icone }: CardInformations) {
  const [data, setData] = useState<AccessInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rejectedUrl = "http://localhost:5267/api/Access/rejected";
  const totalUrl = "http://localhost:5267/api/Access/total";
  const latestUrl = "http://localhost:5267/api/Access/latest";
  const dailyaccessUrl = "http://localhost:5267/api/Access/dailyaccess";

  const fetchData = useCallback(async () => {
    try {
      let urlTarget = "";
      if (titulo === "Acessos diários") {
        urlTarget = dailyaccessUrl;
      } else if (titulo === "Tentativas de acesso") {
        urlTarget = totalUrl;
      } else if (titulo === "Acessos negados") {
        urlTarget = rejectedUrl;
      } else if (titulo === "Último acesso") {
        urlTarget = latestUrl;
      } else {
        setError("Título não encontrado");
      }

      const response = await axios.get(urlTarget, {
        headers: { Accept: "application/json" },
      });

      if (titulo === "Acessos diários" && response.data) {
        setData({ dailyaccess: response.data.todayAccess });
      } else if (titulo === "Tentativas de acesso" && response.data) {
        setData({ total: response.data.totalAccess });
      } else if (titulo === "Acessos negados" && response.data) {
        setData({ rejected: response.data.rejectAccess });
      } else if (titulo === "Último acesso" && response.data) {
        setData({ latest: response.data.hourAccess });
      } else {
        setData(null);
        setError("Nenhum dado encontrado.");
      }
    } catch (error: any) {
      setError(error.response?.data || "Erro ao carregar dados");
      setData(null);
    }
  }, [titulo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <InfoCardTitle titulo={titulo} />
          <InfoCardIcon icone={icone} />
        </div>

        {subtitulo && <p className="text-muted-foreground">{subtitulo}</p>}
      </CardHeader>

      <CardContent>
        {data ? (
          <p className="text-base sm:text-lg font-bold">
            {titulo === "Acessos diários" && `${data.dailyaccess} ${prop}`}
            {titulo === "Tentativas de acesso" && `${data.total} ${prop}`}
            {titulo === "Acessos negados" && `${data.rejected} ${prop}`}
            {titulo === "Último acesso" && `${data.latest} ${prop}`}
          </p>
        ) : (
          <p>Carregando...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </CardContent>
    </Card>
  );
}
