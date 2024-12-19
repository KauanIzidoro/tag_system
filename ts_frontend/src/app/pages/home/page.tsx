"use client"
import InfoCard from "@/components/infocard";
import UserTable from "@/components/usertable";
import { LaptopMinimalCheck, LaptopMinimal, AlarmClockCheck, Hand } from "lucide-react";
import React, { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/sidebar/ThemeContext";

export default function App({ children }: { children: ReactNode }) {
  return (
    <div className="sm:ml-14 p-4 gap-2">
        <ThemeProvider>
            <Sidebar/>
        </ThemeProvider>      
        <h1 className="font-semibold text-4xl border-b">Tag System</h1>
      {/* <h2 className="my-2">Bem vindo de volta Admin</h2> */}

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">

        <InfoCard
          titulo="Último acesso"
          subtitulo="Data e horário do último acesso permitido."
          prop=""
          icone={AlarmClockCheck}
        />

        <InfoCard
          titulo="Acessos diários"
          subtitulo="Número de acessos permitidos hoje."
          prop="acesso(s)"
          icone={LaptopMinimalCheck}
        />

        <InfoCard
          titulo="Tentativas de acesso"
          subtitulo="Número total de tentativas de acesso registradas."
          prop="tentativa(s)"
          icone={LaptopMinimal}
        />

        <InfoCard
          titulo="Acessos negados"
          subtitulo="Número total de tentativas de acessos negados."
          prop="tentativa(s)"
          icone={Hand}
        />
      </section>

      <section className="flex-1 mt-4">
        <UserTable />
      </section>

      <footer className="flex-1 mt-4">
        <p>Todos os direitos reservados, 2024.</p>
      </footer>
    </div>
  );
}
