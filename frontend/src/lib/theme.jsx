import { createContext, useContext, useEffect, useState } from "react";
const ThemeCtx = createContext({ theme: "light", toggle: () => { } });
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light");
    useEffect(() => {
        const stored = (typeof window !== "undefined" && localStorage.getItem("aia:theme"));
        const initial = stored ?? (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        setTheme(initial);
    }, []);
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        localStorage.setItem("aia:theme", theme);
    }, [theme]);
    return (<ThemeCtx.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeCtx.Provider>);
}
export const useTheme = () => useContext(ThemeCtx);
