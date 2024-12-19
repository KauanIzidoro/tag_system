import React from "react";
import { CardTitle } from "../ui/card";

interface InfoCardProps {
  titulo: string;
}

export function InfoCardTitle({ titulo: Titulo }: InfoCardProps) {
  return <CardTitle className="text-lg sm:text-xl select-none">{Titulo}</CardTitle>;
}
