"use client"

import React, { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/sidebar/ThemeContext";
import UserTable from "@/components/usertable";

export default function Reports({ children }: { children: ReactNode }) {
    return (
    <div className="sm:ml-14 p-4">
        <ThemeProvider>
            <Sidebar/>
        </ThemeProvider>      <h1 className="my-2 font-semibold text-4xl border-b">Relatórios</h1>
      <h2 className="my-2">Últimos relatórios gerados</h2>

      <section className="mt-4 flex flex-col md:flex-row gap-4">
        <UserTable />
      </section>
    </div>
    );
}