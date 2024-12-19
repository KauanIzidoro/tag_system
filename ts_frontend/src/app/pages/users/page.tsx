"use client"

import React, { ReactNode } from "react";
import UserCard from "@/components/users";
import RegisterUserTable from "@/components/registertable";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/sidebar/ThemeContext";

export default function Users({ children }: { children: ReactNode }) {
    return (
        <div className="sm:ml-14 p-4">
        <ThemeProvider>
            <Sidebar/>
        </ThemeProvider>            
        <header>
                <h1 className="my-2 font-semibold text-4xl">Usuários do sistema</h1>
            <h2 className="my-2">Administradores, editores e leitores do seu <strong>Tag System</strong>.</h2>
            
            <div>
                <UserCard/>
            </div>
            </header>
            
            <main>
                <h1 className="my-2 font-semibold text-4xl">Usuários da sala</h1>
                <h2 className="my-2">Clientes e colaboradores do seu <strong>Tag System</strong>.</h2>
                <RegisterUserTable />
            </main>
        </div>
    );
}