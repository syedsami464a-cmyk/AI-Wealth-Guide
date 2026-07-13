import { ShieldCheck, TrendingUp, Landmark, Coins, PiggyBank, Repeat } from "lucide-react";
export const products = [
    {
        id: "fd", name: "Fixed Deposit", icon: PiggyBank, category: "Safe & Steady",
        description: "Guaranteed returns with capital protection from banks.",
        expectedReturns: "6.5%", returnRate: 6.5, risk: "Low", safety: 5, liquidity: "Medium",
        taxBenefit: "Sec 80C (5yr)", lockIn: "1–5 Yrs", color: "chart-2",
    },
    {
        id: "rd", name: "Recurring Deposit", icon: Repeat, category: "Disciplined Savings",
        description: "Fixed monthly deposits with assured bank interest — great for building a habit.",
        expectedReturns: "6.7%", returnRate: 6.7, risk: "Low", safety: 5, liquidity: "Medium",
        taxBenefit: "TDS applicable", lockIn: "6M – 10 Yrs", color: "chart-2",
    },
    {
        id: "ppf", name: "PPF", icon: ShieldCheck, category: "Tax Saving",
        description: "Government-backed long-term savings with tax-free returns.",
        expectedReturns: "7.1%", returnRate: 7.1, risk: "Low", safety: 5, liquidity: "Low",
        taxBenefit: "EEE (80C)", lockIn: "15 Yrs", color: "chart-3",
    },
    {
        id: "mf", name: "Mutual Funds", icon: TrendingUp, category: "High Growth",
        description: "Diversified equity funds managed by professional fund managers.",
        expectedReturns: "12–15%", returnRate: 13.5, risk: "Moderate", safety: 3, liquidity: "High",
        taxBenefit: "ELSS 80C", lockIn: "None / 3 Yrs", color: "chart-1",
    },
    {
        id: "gold", name: "Gold ETF", icon: Coins, category: "Inflation Hedge",
        description: "Digital gold that protects wealth against inflation and volatility.",
        expectedReturns: "8–10%", returnRate: 9, risk: "Moderate", safety: 4, liquidity: "High",
        taxBenefit: "LTCG", lockIn: "None", color: "chart-3",
    },
    {
        id: "nps", name: "NPS", icon: Landmark, category: "Retirement",
        description: "National Pension System for retirement with equity+debt mix.",
        expectedReturns: "9–11%", returnRate: 10, risk: "Moderate", safety: 4, liquidity: "Low",
        taxBenefit: "80CCD(1B)", lockIn: "Till 60", color: "chart-4",
    },
];
export function getAllocation(p) {
    // Allocator based on risk — only FD, RD, PPF, NPS, Gold ETF, Mutual Funds
    if (p.risk === "Low")
        return [
            { id: "ppf", name: "PPF", value: 30 },
            { id: "fd", name: "Fixed Deposit", value: 25 },
            { id: "rd", name: "Recurring Deposit", value: 20 },
            { id: "gold", name: "Gold ETF", value: 15 },
            { id: "nps", name: "NPS", value: 10 },
        ];
    if (p.risk === "High")
        return [
            { id: "mf", name: "Mutual Funds", value: 50 },
            { id: "nps", name: "NPS", value: 20 },
            { id: "gold", name: "Gold ETF", value: 15 },
            { id: "ppf", name: "PPF", value: 10 },
            { id: "rd", name: "Recurring Deposit", value: 5 },
        ];
    return [
        { id: "mf", name: "Mutual Funds", value: 30 },
        { id: "ppf", name: "PPF", value: 25 },
        { id: "fd", name: "Fixed Deposit", value: 15 },
        { id: "rd", name: "Recurring Deposit", value: 10 },
        { id: "gold", name: "Gold ETF", value: 10 },
        { id: "nps", name: "NPS", value: 10 },
    ];
}
// Weighted blended annual return for the recommended allocation
export function blendedReturn(p) {
    const alloc = getAllocation(p);
    let r = 0;
    for (const a of alloc) {
        const prod = products.find((x) => x.id === a.id);
        if (prod)
            r += (prod.returnRate * a.value) / 100;
    }
    return r;
}
// Simulate current value & profit assuming existing investments grew at blended rate for `heldYears`
export function computeProfit(p, heldYears = 2) {
    const rate = blendedReturn(p) / 100;
    const invested = p.existingInvestments;
    const currentValue = Math.round(invested * Math.pow(1 + rate, heldYears));
    const profit = currentValue - invested;
    const profitPct = invested > 0 ? (profit / invested) * 100 : 0;
    return { invested, currentValue, profit, profitPct, rate: rate * 100 };
}

export function computePlanMetrics(profile, recommendation, heldYears = 2) {
    const productName = recommendation?.product || recommendation?.recommended_product;
    const normalized = (productName || "").toLowerCase();
    const productMap = [
        { id: "fd", patterns: ["fixed deposit", "fd"] },
        { id: "rd", patterns: ["recurring deposit", "rd"] },
        { id: "ppf", patterns: ["ppf", "public provident fund", "public provident"] },
        { id: "mf", patterns: ["mutual fund", "mutual funds", "mf"] },
        { id: "gold", patterns: ["gold etf", "gold"] },
        { id: "nps", patterns: ["nps", "national pension system"] },
    ];

    const match = productMap.find(({ patterns }) =>
        patterns.some((pattern) => normalized.includes(pattern))
    );

    const product = products.find((item) => item.id === match?.id);
    const annualRate = product?.returnRate ?? blendedReturn(profile);
    const invested = Number(profile.existingInvestments || 0);
    const currentValue = Math.round(invested * Math.pow(1 + annualRate / 100, heldYears));
    const profit = currentValue - invested;
    const profitPct = invested > 0 ? (profit / invested) * 100 : 0;

    return {
        invested,
        currentValue,
        profit,
        profitPct,
        rate: annualRate,
        recommendedProduct: product,
    };
}
// Project future value with monthly SIP + lumpsum for goal planner
export function projectGoal(currentAmount, monthlySip, years, annualRatePct) {
    const r = annualRatePct / 100 / 12;
    const n = years * 12;
    const fvLump = currentAmount * Math.pow(1 + r, n);
    const fvSip = monthlySip * ((Math.pow(1 + r, n) - 1) / (r || 1e-9)) * (1 + r);
    return Math.round(fvLump + fvSip);
}
// Solve months required to reach target with SIP + starting amount
export function monthsToGoal(target, current, monthlySip, annualRatePct) {
    const r = annualRatePct / 100 / 12;
    let bal = current;
    let m = 0;
    while (bal < target && m < 12 * 60) {
        bal = bal * (1 + r) + monthlySip;
        m++;
    }
    return m;
}
export const chatSuggestions = [
    "Why is PPF recommended?",
    "Is FD better than Mutual Funds?",
    "Which investment saves tax?",
    "Explain Government Bonds.",
    "What is NPS?",
];
export function mockAiReply(question) {
    const q = question.toLowerCase();
    if (q.includes("ppf"))
        return "PPF (Public Provident Fund) is a government-backed scheme offering ~7.1% tax-free returns with EEE tax status. It's recommended for long-term, risk-averse investors as returns and maturity are fully tax exempt under Section 80C.";
    if (q.includes("fd") && q.includes("mutual"))
        return "FDs give guaranteed ~6.5% returns with capital safety, ideal for short-term goals. Mutual Funds historically deliver 12–15% but come with market risk. For long horizons (>5 yrs), mutual funds typically outperform.";
    if (q.includes("tax"))
        return "ELSS Mutual Funds, PPF, NPS (80CCD(1B) extra ₹50k), and 5-year tax-saver FDs offer tax deductions under Sec 80C/80CCD. ELSS has the shortest lock-in (3 years) among tax-saving instruments.";
    if (q.includes("bond"))
        return "Government Bonds are sovereign-backed debt instruments offering ~7.2% fixed interest. They're highly safe, provide predictable income, and are ideal for conservative portfolios seeking stability.";
    if (q.includes("nps"))
        return "NPS (National Pension System) is a retirement product with equity + debt exposure, giving ~9–11% long-term returns. It offers an extra ₹50,000 tax deduction under 80CCD(1B), locked in until age 60.";
    return "Great question! Based on your profile, I'd suggest diversifying across equity mutual funds for growth, PPF for tax-free stability, and a small gold allocation to hedge inflation. Want me to break this down further?";
}
