import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, Bot, Layers, ScaleIcon, HeartPulse, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/profile-store";
import { computePlanMetrics } from "@/lib/mock-data";
import { loadSelectedHistoryRecord } from "@/lib/profile-store";
const features = [
    { icon: Sparkles, title: "Personalized Recommendations", desc: "AI-tuned picks based on your profile, goals, and risk." },
    { icon: HeartPulse, title: "Financial Health Score", desc: "Instant insight into your financial fitness." },
    { icon: Bot, title: "AI Financial Assistant", desc: "Ask anything, learn about products in plain English." },
    { icon: Target, title: "Goal Planning", desc: "Track progress towards house, retirement, and more." },
    { icon: Layers, title: "Portfolio Allocation", desc: "Beautifully visualized diversified allocation." },
    { icon: ScaleIcon, title: "Product Comparison", desc: "Compare FDs, MFs, PPF, NPS side-by-side." },
];
function Index() {
    return (<div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-secondary/10"/>
        <div className="absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl"/>
        <div className="absolute -bottom-24 -left-24 -z-10 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"/>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5"/> Powered by Generative AI
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Smart Investment Advisor <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Powered by AI</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              Get personalized investment recommendations based on your financial profile, goals, and risk appetite — in seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/profile">
                <Button size="lg" className="rounded-xl h-12 px-6 text-base">
                  Get Started <ArrowRight className="ml-1 h-4 w-4"/>
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="rounded-xl h-12 px-6 text-base">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
            { v: "12%+", l: "Avg. returns" },
            { v: "50k+", l: "Portfolios" },
            { v: "4.9★", l: "User rating" },
        ].map((s) => (<div key={s.l}>
                  <div className="text-2xl font-bold text-foreground">{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }} className="relative">
            <HeroCard />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need to invest smarter</h2>
          <p className="mt-3 text-muted-foreground">A premium fintech toolkit designed around your goals.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (<motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} whileHover={{ y: -4 }} className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elevated transition-shadow">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <f.icon className="h-6 w-6"/>
              </div>
              <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-secondary p-10 md:p-14 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%)]"/>
          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Ready to build your personalized plan?</h3>
              <p className="mt-2 text-primary-foreground/80">Takes under 2 minutes. No signup required.</p>
            </div>
            <Link to="/profile">
              <Button size="lg" variant="secondary" className="rounded-xl h-12 px-6 text-base bg-white text-primary hover:bg-white/90">
                Start Now <ArrowRight className="ml-1 h-4 w-4"/>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>);
}
function HeroCard() {
    const profile = useProfile();
    const selectedHistoryRecord = loadSelectedHistoryRecord();
    const recommendationToDisplay = selectedHistoryRecord
      ? { product: selectedHistoryRecord.recommended_product, risk: selectedHistoryRecord.risk_level }
      : profile.recommendation;
    const { invested, profit, profitPct, currentValue } = computePlanMetrics(profile, recommendationToDisplay);
    return (<div className="relative">
      <div className="rounded-3xl bg-card border border-border shadow-elevated p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Projected growth</div>
            <div className="text-3xl font-bold mt-1 text-secondary">₹{profit.toLocaleString("en-IN")}</div>
            <div className="text-xs text-muted-foreground mt-1">
              based on your current ₹{invested.toLocaleString("en-IN")} portfolio · estimated value ₹{currentValue.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="text-secondary flex items-center gap-1 text-sm font-semibold">
            <TrendingUp className="h-4 w-4"/> +{profitPct.toFixed(1)}%
          </div>
        </div>
        <svg viewBox="0 0 300 120" className="mt-4 w-full h-32">
          <defs>
            <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0,90 C40,80 60,60 90,55 C120,50 140,70 170,50 C200,30 220,40 260,20 L300,10 L300,120 L0,120 Z" fill="url(#g)"/>
          <path d="M0,90 C40,80 60,60 90,55 C120,50 140,70 170,50 C200,30 220,40 260,20 L300,10" fill="none" stroke="var(--color-primary)" strokeWidth="2.5"/>
        </svg>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { l: "Mutual Funds", v: "30%", c: "bg-primary" },
            { l: "PPF + NPS", v: "35%", c: "bg-secondary" },
            { l: "FD/RD/Gold", v: "35%", c: "bg-chart-3" },
        ].map((a) => (<div key={a.l} className="rounded-xl bg-muted p-3">
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${a.c}`}/>
                <span className="text-xs text-muted-foreground truncate">{a.l}</span>
              </div>
              <div className="mt-1 font-semibold">{a.v}</div>
            </div>))}
        </div>
      </div>
    </div>);
}

export default Index;
