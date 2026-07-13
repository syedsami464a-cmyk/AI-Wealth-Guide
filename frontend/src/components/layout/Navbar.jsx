import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, Bot } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
const links = [
    { to: "/", label: "Home" },
    { to: "/profile", label: "Get Plan" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/recommendations", label: "Recommendations" },
    { to: "/history", label: "History" },
    { to: "/assistant", label: "AI Assistant" },
    { to: "/about", label: "About" },
];
export function Navbar() {
    const pathname = useLocation().pathname;
    const [open, setOpen] = useState(false);
    const { theme, toggle } = useTheme();
    return (<header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <img src="/logo.PNG" alt="AI Wealth Guide logo" className="h-9 w-9 rounded-xl object-cover shadow-soft" />
          <span>AI Wealth Guide</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.to;
            return (<Link key={l.to} to={l.to} className={cn("px-3 py-2 rounded-lg text-sm font-medium transition-colors", active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                {l.label}
              </Link>);
        })}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={toggle} aria-label="Toggle theme" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background hover:bg-muted transition-colors">
            {theme === "dark" ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
          </button>
          <div className="hidden sm:block">
            <Link to="/profile">
              <Button size="sm" className="rounded-xl">Get Started</Button>
            </Link>
          </div>
          <Link to="/assistant" aria-label="Open AI Assistant" className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-soft hover:shadow-elevated transition-shadow">
            <Bot className="h-4 w-4"/>
          </Link>
          <button className="lg:hidden grid h-9 w-9 place-items-center rounded-lg border border-border" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <X className="h-4 w-4"/> : <Menu className="h-4 w-4"/>}
          </button>
        </div>
      </div>

      {open && (<div className="lg:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (<Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={cn("px-3 py-2 rounded-lg text-sm font-medium", pathname === l.to
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:bg-muted")}>
                {l.label}
              </Link>))}
          </div>
        </div>)}
    </header>);
}
