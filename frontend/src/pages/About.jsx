import { Sparkles, ShieldCheck, Zap, Target } from "lucide-react";
function AboutPage() {
    return (<div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 space-y-10">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5"/> Our Mission
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Investing, simplified by AI</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          AI Investment Advisor combines generative AI with financial best practices to deliver personalized investment plans that anyone can understand and act on.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {[
            { icon: Sparkles, title: "Personalized", desc: "Every recommendation is tailored to your profile, goals, and risk appetite." },
            { icon: ShieldCheck, title: "Trustworthy", desc: "Grounded in classic portfolio theory and verified financial products." },
            { icon: Zap, title: "Fast", desc: "Build your plan in under 2 minutes — no signup, no friction." },
            { icon: Target, title: "Goal-Oriented", desc: "Track progress across retirement, house, tax saving, and more." },
        ].map((f) => (<div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <f.icon className="h-6 w-6"/>
            </div>
            <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
          </div>))}
      </div>

      <p className="text-xs text-center text-muted-foreground max-w-2xl mx-auto">
        Disclaimer: This platform is for educational purposes only and does not constitute financial advice. Consult a certified financial advisor before making investment decisions.
      </p>
    </div>);
}

export default AboutPage;
