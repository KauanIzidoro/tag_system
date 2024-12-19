// src/context/ThemeContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ThemeContextType = {
  dark: boolean;
  setDark: (value: boolean | ((prev: boolean) => boolean)) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
