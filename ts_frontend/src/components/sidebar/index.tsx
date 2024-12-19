import { useTheme } from "./ThemeContext";
import Link from 'next/link';
import { ChartArea, ClipboardList, Eye, Home, LogOut, SunMoon, Users } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { usePathname } from "next/navigation";
import "@/styles/styles.css";
import { useEffect } from "react";

export function Sidebar() {
    const { dark, setDark } = useTheme();
    const pathname = usePathname(); // Obter o caminho atual

    // Atualiza o tema globalmente no HTML
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [dark]);

    return (
        <div className={`flex w-full flex-col ${dark ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col'>
                <nav className='flex flex-col items-center gap-4 px-2 py-5'>
                    <TooltipProvider>
                        <Link
                            href="#"
                            className='flex h-10 w-10 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-full'
                        >
                            <Eye className='h-6 w-6' />
                            <span className='sr-only'>Icone Osiris "Olho"</span>
                        </Link>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/pages/home"
                                    className={`sidebar ${pathname === '/pages/home' ? 'active' : ''}`}
                                >
                                    <Home className='h-5 w-5' />
                                    <span className='sr-only'>Icone Início</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side='left'>Início</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/pages/charts"
                                    className={`sidebar ${pathname === '/pages/charts' ? 'active' : ''}`}
                                >
                                    <ChartArea className='h-5 w-5' />
                                    <span className='sr-only'>Icone Dashboards</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side='left'>Dashboards</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/pages/reports"
                                    className={`sidebar ${pathname === '/pages/reports' ? 'active' : ''}`}
                                >
                                    <ClipboardList className='h-5 w-5' />
                                    <span className='sr-only'>Icone Relatórios</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side='left'>Relatórios</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/pages/users"
                                    className={`sidebar ${pathname === '/pages/users' ? 'active' : ''}`}
                                >
                                    <Users className='h-5 w-5' />
                                    <span className='sr-only'>Icone Usuários</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side='left'>Usuários</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>

                <nav className='mt-auto flex flex-col items-center gap-4 px-2 py-5'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="#"
                                    className='flex h-10 w-10 shrink-0 items-center justify-center 
                            rounded-lg text-muted-foreground transition-colors hover:text-foreground'
                                    onClick={() => setDark(!dark)}
                                >
                                    <SunMoon className="h-5 w-5" />
                                    <span className='sr-only'>Tema</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Tema</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/"
                                    className='flex h-10 w-10 shrink-0 items-center justify-center 
                            rounded-lg text-muted-foreground transition-colors hover:text-red-500'
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className='sr-only'>Sair</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Sair</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
            </aside>
        </div>
    );
}
