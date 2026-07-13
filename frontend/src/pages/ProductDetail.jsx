import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Shield, Clock, Wallet, Sparkles } from "lucide-react";
import { products, projectGoal } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/profile-store";
function ProductPage() {
    const { id } = useParams();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [id]);

    const p = products.find((x) => x.id === id);
    if (!p) {
        return (
            <div className="mx-auto max-w-3xl px-6 py-24 text-center">
                <h1 className="text-3xl font-bold">Product not found</h1>
                <Link to="/recommendations"><Button className="mt-6 rounded-xl">Browse products</Button></Link>
            </div>
        );
    }
    const profile = useProfile();
    const monthly = Math.max(1000, profile.monthlyIncome - profile.monthlyExpenses);
    const suggestedSip = Math.round(monthly * 0.25);
    const fv5 = projectGoal(0, suggestedSip, 5, p.returnRate);
    const fv10 = projectGoal(0, suggestedSip, 10, p.returnRate);
    return (<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link to="/recommendations" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4"/> Back to products
      </Link>

      <div className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-10 shadow-soft">
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
            <p.icon className="h-8 w-8"/>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">{p.name}</h1>
          </div>
          <div className="ml-auto rounded-2xl bg-secondary/10 text-secondary px-4 py-2">
            <div className="text-[10px] uppercase tracking-wider font-semibold">Expected Return</div>
            <div className="text-2xl font-bold">{p.expectedReturns}</div>
          </div>
        </div>
        <p className="mt-5 text-base text-muted-foreground max-w-3xl">{p.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Info icon={TrendingUp} label="Annual Return" value={p.expectedReturns} tone="text-secondary"/>
        <Info icon={Shield} label="Risk Level" value={p.risk}/>
        <Info icon={Wallet} label="Liquidity" value={p.liquidity}/>
        <Info icon={Clock} label="Lock-in" value={p.lockIn}/>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/> Personalized Projection</h2>
          <p className="text-sm text-muted-foreground">If you invest a suggested SIP of ₹{suggestedSip.toLocaleString("en-IN")} / month at {p.expectedReturns}:</p>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <Bucket label="In 5 years" value={fv5}/>
            <Bucket label="In 10 years" value={fv10}/>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-xl font-bold mb-4">Key Details</h2>
          <dl className="space-y-3 text-sm">
            <Row k="Tax Benefit" v={p.taxBenefit}/>
            <Row k="Minimum Horizon" v={p.lockIn}/>
            <Row k="Safety" v={p.risk === "Low" ? "Capital protected" : p.risk === "Moderate" ? "Market-linked" : "High volatility"}/>
            <Row k="Best For" v={bestFor(p.id)}/>
          </dl>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-xl font-bold mb-4">How to Start</h2>
        <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
          <li>Decide monthly contribution based on your savings capacity.</li>
          <li>Open an account with a bank or broker offering {p.name}.</li>
          <li>Set up an auto-debit / SIP for consistent investing.</li>
          <li>Review your allocation every 6 months and rebalance if needed.</li>
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/dashboard"><Button className="rounded-xl">View my Plan</Button></Link>
          <Link to="/assistant"><Button variant="outline" className="rounded-xl">Ask AI Advisor</Button></Link>
        </div>
      </div>
    </div>);
}
function Info({ icon: Icon, label, value, tone }) {
    return (<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary"/>
      </div>
      <div className={`mt-2 text-xl font-bold ${tone ?? ""}`}>{value}</div>
    </motion.div>);
}
function Bucket({ label, value }) {
    return (<div className="rounded-xl bg-muted p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold text-secondary">₹{value.toLocaleString("en-IN")}</div>
    </div>);
}
function Row({ k, v }) {
    return (<div className="flex items-start justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium text-right">{v}</dd>
    </div>);
}
function bestFor(id) {
    const m = {
        fd: "Short-term, low-risk savers",
        rd: "Building disciplined monthly savings",
        ppf: "Long-term tax-free wealth",
        nps: "Retirement planning",
        gold: "Inflation hedge & diversification",
        mf: "Long-term wealth creation",
    };
    return m[id] ?? "Balanced investors";
}

export default ProductPage;
