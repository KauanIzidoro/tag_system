import React from "react";

interface InfoCardProps {
  icone: React.FC<React.SVGProps<SVGSVGElement>>;
}

export function InfoCardIcon({ icone: Icone }: InfoCardProps) {
  return <Icone className="ml-auto w-5 h-5" />;
}
