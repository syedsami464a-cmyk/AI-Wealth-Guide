import { Link } from "react-router-dom";
import { Github, Linkedin, LineChart } from "lucide-react";
export function Footer() {
    return (<footer className="border-t border-border bg-card mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <LineChart className="h-4 w-4"/>
            </span>
            AI Investment Advisor
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Personalized investment recommendations powered by AI, built for modern investors.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            <li><Link to="/recommendations" className="hover:text-foreground">Recommendations</Link></li>
            <li><Link to="/assistant" className="hover:text-foreground">AI Assistant</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><a href="#" className="hover:text-foreground">Privacy</a></li>
            <li><a href="#" className="hover:text-foreground">Terms</a></li>
            <li><a href="#" className="hover:text-foreground">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Connect</h4>
          <div className="flex gap-3">
            <a href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-muted" aria-label="GitHub">
              <Github className="h-4 w-4"/>
            </a>
            <a href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-muted" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4"/>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} AI Investment Advisor. For educational purposes only — not financial advice.
        </div>
      </div>
    </footer>);
}
