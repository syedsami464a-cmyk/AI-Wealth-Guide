import { useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ArrowRight, Sparkles, TrendingUp, Target, Wallet, ShieldCheck, PiggyBank, CircleDot, ArrowUpRight } from "lucide-react";
import { useProfile, computeHealthScore, loadSelectedHistoryRecord, saveSelectedHistoryRecord } from "@/lib/profile-store";
import { getAllocation, products, computePlanMetrics, blendedReturn, projectGoal, monthsToGoal } from "@/lib/mock-data";
import { getRecommendedProduct } from "@/lib/recommendation-utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
const CHART_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];
function DashboardPage() {
    const profile = useProfile();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const historyIdFromUrl = searchParams.get("id");
    const routedRecord = location.state?.record;
    const selectedHistoryRecord = routedRecord ?? (historyIdFromUrl ? loadSelectedHistoryRecord() : null);

    useEffect(() => {
      if (routedRecord) {
        saveSelectedHistoryRecord(routedRecord);
        return;
      }

      if (historyIdFromUrl) {
        const storedRecord = loadSelectedHistoryRecord();
        if (!storedRecord || String(storedRecord.id) !== historyIdFromUrl) {
          saveSelectedHistoryRecord(null);
        }
        return;
      }

      saveSelectedHistoryRecord(null);
    }, [routedRecord, historyIdFromUrl]);

    const viewProfile = selectedHistoryRecord ? {
      ...profile,
      monthlyIncome: Number(selectedHistoryRecord.monthly_income || profile.monthlyIncome || 0),
      monthlyExpenses: Math.max(1, Number(selectedHistoryRecord.monthly_income || profile.monthlyIncome || 0) - Number(selectedHistoryRecord.monthly_savings || (profile.monthlyIncome - profile.monthlyExpenses) || 0)),
      goal: selectedHistoryRecord.investment_goal || profile.goal,
      risk: selectedHistoryRecord.risk_level || profile.risk,
      occupation: selectedHistoryRecord.occupation || profile.occupation,
      recommendation: {
        product: selectedHistoryRecord.recommended_product,
        risk: selectedHistoryRecord.risk_level,
        description: `Saved recommendation for ${selectedHistoryRecord.name}. This plan was generated earlier and can be reviewed again here.`,
      },
    } : profile;

    const score = computeHealthScore(viewProfile);
    const status = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs Work";
    const allocation = getAllocation(viewProfile);
    const monthlySavings = viewProfile.monthlyIncome - viewProfile.monthlyExpenses;
    const savingsRate = Math.round((monthlySavings / Math.max(viewProfile.monthlyIncome, 1)) * 100);
    const expenseRatio = Math.round((viewProfile.monthlyExpenses / Math.max(viewProfile.monthlyIncome, 1)) * 100);
    const emergencyMonths = (viewProfile.emergencyFund / Math.max(viewProfile.monthlyExpenses, 1)).toFixed(1);
    const investmentRatio = Math.round((viewProfile.existingInvestments / Math.max(viewProfile.annualIncome, 1)) * 100);
    const recommendedProducts = allocation
        .map((a) => ({ ...products.find((p) => p.id === a.id), allocation: a.value }))
        .filter(Boolean);
    const recommendationToDisplay = selectedHistoryRecord
        ? {
            product: selectedHistoryRecord.recommended_product,
            risk: selectedHistoryRecord.risk_level,
            description: `Saved recommendation for ${selectedHistoryRecord.name}. This plan was generated earlier and can be reviewed again here.`,
          }
        : profile.recommendation;
    const aiRecommendation = recommendationToDisplay;
    const recommendedProduct = getRecommendedProduct(aiRecommendation);
    const aiExpectedReturn = aiRecommendation?.expected_return || recommendedProduct?.expectedReturns || "—";
    const aiRisk = aiRecommendation?.risk || recommendedProduct?.risk || "—";
    const aiDescription = aiRecommendation?.description || recommendedProduct?.description || "Complete your profile to generate a personalized recommendation.";
    const { invested, currentValue, profit, profitPct, rate } = computePlanMetrics(viewProfile, aiRecommendation);
    const blended = blendedReturn(viewProfile);
    return (<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Your Investment Plan</h1>
          <p className="mt-1 text-muted-foreground">Personalized for {viewProfile.goal.toLowerCase()} · {viewProfile.duration}</p>
        </div>
        <Link to="/profile"><Button variant="outline" className="rounded-xl">Edit Profile</Button></Link>
      </div>

      {/* Portfolio Profit Hero */}
      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-secondary/10 p-6 sm:p-8 shadow-soft">
        <div className="grid gap-6 sm:grid-cols-3 items-center">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Projected Growth</div>
            <div className="mt-2 text-4xl sm:text-5xl font-extrabold text-secondary">
              ₹{profit.toLocaleString("en-IN")}
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-secondary">
              <ArrowUpRight className="h-4 w-4"/> +{profitPct.toFixed(2)}% overall
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Current Portfolio</div>
            <div className="mt-2 text-2xl font-bold">₹{invested.toLocaleString("en-IN")}</div>
            <div className="text-xs text-muted-foreground mt-1">Based on your saved profile and plan</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Estimated Value</div>
            <div className="mt-2 text-2xl font-bold">₹{currentValue.toLocaleString("en-IN")}</div>
            <div className="text-xs text-muted-foreground mt-1">At {rate.toFixed(1)}% p.a. from your chosen plan</div>
          </div>
        </div>
      </div>

      {/* Top Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground">Financial Health Score</div>
              <div className="text-xs text-secondary font-semibold mt-0.5">{status}</div>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5"/>
            </div>
          </div>
          <div className="flex items-center justify-center py-2">
            <CircularScore value={score}/>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">Risk Profile</div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/10 text-secondary">
              <ShieldCheck className="h-5 w-5"/>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold">{viewProfile.risk}</div>
            <span className={`inline-flex mt-3 items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${viewProfile.risk === "Low" ? "bg-secondary/15 text-secondary" :
            viewProfile.risk === "High" ? "bg-destructive/15 text-destructive" :
                "bg-chart-3/20 text-chart-3"}`}>
              <CircleDot className="h-3 w-3"/>
              {viewProfile.risk === "Low" ? "Conservative" : viewProfile.risk === "High" ? "Aggressive" : "Balanced"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Portfolio blended for {viewProfile.risk.toLowerCase()} tolerance over {viewProfile.duration.toLowerCase()}.
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">Monthly Savings</div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-chart-3/15 text-chart-3">
              <PiggyBank className="h-5 w-5"/>
            </div>
          </div>
          <div className="text-3xl font-bold">₹{monthlySavings.toLocaleString("en-IN")}</div>
          <div className="mt-3 text-xs text-muted-foreground">Savings Rate</div>
          <Progress value={savingsRate} className="mt-1.5 h-2"/>
          <div className="mt-1 text-xs font-semibold text-secondary">{savingsRate}%</div>
        </Card>
      </div>

      {/* Insights */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Investment Ratio" value={`${investmentRatio}%`} sub="of annual income" color="bg-primary/10 text-primary" icon={TrendingUp}/>
        <Stat label="Emergency Fund" value={`${emergencyMonths} mo`} sub="of expenses covered" color="bg-secondary/10 text-secondary" icon={ShieldCheck}/>
        <Stat label="Expense Ratio" value={`${expenseRatio}%`} sub="of monthly income" color="bg-chart-3/15 text-chart-3" icon={Wallet}/>
        <Stat label="Goal Progress" value="40%" sub={`Towards ${viewProfile.goal}`} color="bg-chart-4/15 text-chart-4" icon={Target}/>
      </div>

      {selectedHistoryRecord ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm shadow-soft">
          <div className="font-semibold text-primary">Viewing a saved recommendation</div>
          <p className="mt-1 text-muted-foreground">
            {selectedHistoryRecord.name} • {selectedHistoryRecord.occupation} • {selectedHistoryRecord.investment_goal}
          </p>
        </div>
      ) : null}

      {/* AI Recommendation + Recommended Products + Pie */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {recommendedProduct ? (
            <Link to={`/products/${recommendedProduct.id}`} className="block rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:border-primary/40 hover:shadow-elevated">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-primary">AI Recommendation</div>
                  <h2 className="text-xl font-bold mt-1">Your best-fit investment</h2>
                </div>
                <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {selectedHistoryRecord ? "From your history" : "Powered by backend"}
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
                <div>
                  <div className="text-lg font-semibold">{aiRecommendation?.product || recommendedProduct?.name || "No recommendation yet"}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{aiDescription}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Expected Return</div>
                  <div className="mt-1 text-2xl font-extrabold text-secondary">{aiExpectedReturn}</div>
                  <div className="mt-3 text-xs text-muted-foreground">Risk level</div>
                  <div className="mt-1 text-sm font-semibold">{aiRisk}</div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-primary">AI Recommendation</div>
                  <h2 className="text-xl font-bold mt-1">Your best-fit investment</h2>
                </div>
                <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {selectedHistoryRecord ? "From your history" : "Powered by backend"}
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
                <div>
                  <div className="text-lg font-semibold">{aiRecommendation?.product || recommendedProduct?.name || "No recommendation yet"}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{aiDescription}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Expected Return</div>
                  <div className="mt-1 text-2xl font-extrabold text-secondary">{aiExpectedReturn}</div>
                  <div className="mt-3 text-xs text-muted-foreground">Risk level</div>
                  <div className="mt-1 text-sm font-semibold">{aiRisk}</div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-xl font-bold mb-4">Recommended Products</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {recommendedProducts.map((p, i) => {
                const isRecommended = p.id === recommendedProduct?.id;
                return (<motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }} whileHover={{ y: -3 }}>
                    <Link to={`/products/${p.id}`} className={`block rounded-xl border p-4 transition-all hover:shadow-elevated hover:border-primary/40 ${isRecommended ? "border-primary/40 bg-primary/[0.03] shadow-soft" : "border-border"}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                            <p.icon className="h-5 w-5"/>
                          </div>
                          <div>
                            <div className="font-semibold hover:text-primary transition-colors">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.category}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {isRecommended ? <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">AI Pick</span> : null}
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                            {p.allocation}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 rounded-lg bg-secondary/5 border border-secondary/20 p-3">
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Expected Return</div>
                        <div className="mt-0.5 text-2xl font-extrabold text-secondary">{p.expectedReturns}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          ≈ ₹{Math.round((invested * (p.allocation / 100) * p.returnRate) / 100).toLocaleString("en-IN")} / yr on your share
                        </div>
                      </div>
                      <div className="mt-3 text-xs font-semibold text-primary flex items-center gap-1">
                        View details <ArrowRight className="h-3 w-3"/>
                      </div>
                    </Link>
                  </motion.div>);
              })}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-xl font-bold mb-2">Portfolio Allocation</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {allocation.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]}/>))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`}/>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-xl font-bold mb-6">Investment Timeline</h2>
        <div className="relative">
          <div className="absolute left-0 right-0 top-6 h-0.5 bg-gradient-to-r from-primary via-chart-3 to-secondary"/>
          <div className="grid grid-cols-3 gap-4 relative">
            {[
            { label: "Current Year", value: "2026", color: "bg-primary" },
            { label: "Investment Growth", value: `${viewProfile.duration}`, color: "bg-chart-3" },
            { label: "Goal Achievement", value: viewProfile.goal, color: "bg-secondary" },
        ].map((s, i) => (<div key={i} className="flex flex-col items-center text-center">
                <div className={`${s.color} h-12 w-12 rounded-full grid place-items-center text-primary-foreground font-bold shadow-elevated`}>
                  {i + 1}
                </div>
                <div className="mt-3 font-semibold">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.value}</div>
              </div>))}
          </div>
        </div>
      </div>

      {/* Personalized Goal Planner */}
      <GoalPlanner profile={viewProfile} />
    </div>);
}
function GoalPlanner({ profile }) {
    const monthlySavings = Math.max(1000, profile.monthlyIncome - profile.monthlyExpenses);
    const suggestedSip = Math.round(monthlySavings * 0.5);
    const rate = blendedReturn(profile);
    const goalTargets = {
        "House Purchase": 5000000,
        "Retirement": 20000000,
        "Child Education": 3000000,
        "Emergency Fund": profile.monthlyExpenses * 6,
        "Wealth Creation": Math.max(profile.annualIncome * 5, 2500000),
        "Tax Saving": 150000,
    };
    const target = goalTargets[profile.goal] ?? 2500000;
    const current = profile.existingInvestments;
    const monthsNeeded = monthsToGoal(target, current, suggestedSip, rate);
    const yearsNeeded = (monthsNeeded / 12).toFixed(1);
    const startBy = new Date();
    startBy.setDate(startBy.getDate() + 30);
    const projected5 = projectGoal(current, suggestedSip, 5, rate);
    const earlyExitValue = Math.round(current * Math.pow(1 + rate / 100, 1)); // 1yr conservative
    return (<div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">Goal Planner</h2>
          <p className="text-sm text-muted-foreground mt-1">Personalized for your goal: <span className="font-semibold text-foreground">{profile.goal}</span></p>
        </div>
        <Link to="/recommendations"><Button variant="outline" size="sm" className="rounded-lg">Compare Products <ArrowRight className="ml-1 h-3 w-3"/></Button></Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Target Amount</div>
          <div className="mt-2 text-3xl font-extrabold">₹{(target / 100000).toFixed(1)}L</div>
          <div className="mt-3 text-xs text-muted-foreground">
            Currently at <span className="font-semibold text-foreground">₹{(current / 100000).toFixed(1)}L</span>
          </div>
          <Progress value={Math.min(100, (current / target) * 100)} className="mt-3 h-2"/>
        </div>

        <div className="rounded-xl border border-border bg-gradient-to-br from-secondary/10 to-transparent p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Time to Reach Goal</div>
          <div className="mt-2 text-3xl font-extrabold text-secondary">{yearsNeeded} yrs</div>
          <div className="mt-3 text-xs text-muted-foreground">
            With a SIP of <span className="font-semibold text-foreground">₹{suggestedSip.toLocaleString("en-IN")}/mo</span> at ~{rate.toFixed(1)}% p.a.
          </div>
          <div className="mt-3 text-xs">
            <span className="text-muted-foreground">Start by </span>
            <span className="font-semibold text-primary">{startBy.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span className="text-muted-foreground"> for best results.</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-gradient-to-br from-chart-4/10 to-transparent p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Projected in 5 yrs</div>
          <div className="mt-2 text-3xl font-extrabold">₹{(projected5 / 100000).toFixed(1)}L</div>
          <div className="mt-3 text-xs text-muted-foreground">
            If you stop / withdraw early in 1 yr, expected value ≈{" "}
            <span className="font-semibold text-foreground">₹{earlyExitValue.toLocaleString("en-IN")}</span>
          </div>
          <div className="mt-3 text-xs text-destructive font-medium">
            Early exit forfeits ~{(rate * 2).toFixed(1)}% compounded growth.
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-muted/50 border border-border p-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Action Plan:</span>{" "}
        Start a ₹{suggestedSip.toLocaleString("en-IN")}/mo SIP within the next 30 days, split across your recommended allocation. Review quarterly and increase SIP by 10% annually to reach <span className="font-semibold text-foreground">{profile.goal}</span> in <span className="font-semibold text-secondary">{yearsNeeded} years</span>.
      </div>
    </div>);
}
function Card({ children }) {
    return <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">{children}</div>;
}
function Stat({ label, value, sub, color, icon: Icon }) {
    return (<div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className={`grid h-9 w-9 place-items-center rounded-lg ${color}`}>
          <Icon className="h-4 w-4"/>
        </div>
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>);
}
function CircularScore({ value }) {
    const size = 140;
    const stroke = 12;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c - (value / 100) * c;
    return (<svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="stroke-muted" fill="none"/>
      <motion.circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} stroke="var(--color-primary)" strokeLinecap="round" fill="none" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.2, ease: "easeOut" }}/>
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" transform={`rotate(90 ${size / 2} ${size / 2})`} className="fill-foreground font-bold" style={{ fontSize: 28 }}>
        {value}
      </text>
    </svg>);
}

export default DashboardPage;
