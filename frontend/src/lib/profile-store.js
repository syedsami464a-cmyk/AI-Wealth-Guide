import { useEffect, useState } from "react";

const KEY = "aia:profile";

export const defaultProfile = {
  age: 30,
  occupation: "Software Engineer",

  annualIncome: 1200000,
  monthlyIncome: 100000,
  monthlyExpenses: 45000,

  currentSavings: 500000,
  existingInvestments: 300000,
  emergencyFund: 200000,

  goal: "Wealth Creation",
  duration: "5–10 Years",
  risk: "Medium",

  recommendation: null,
};

export function saveProfile(profile) {
  if (typeof window === "undefined") return;

  localStorage.setItem(KEY, JSON.stringify(profile));
}

export function loadProfile() {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function useProfile() {
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    const data = loadProfile();

    if (data) {
      setProfile({
        ...defaultProfile,
        ...data,
      });
    }
  }, []);

  return profile;
}

export function computeHealthScore(profile) {

  const savingsRate =
    (profile.monthlyIncome - profile.monthlyExpenses) /
    Math.max(profile.monthlyIncome, 1);

  const emergencyMonths =
    profile.emergencyFund /
    Math.max(profile.monthlyExpenses, 1);

  const investmentRatio =
    profile.existingInvestments /
    Math.max(profile.annualIncome, 1);

  let score = 0;

  score += Math.min(savingsRate * 100, 40);

  score += Math.min(emergencyMonths * 5, 30);

  score += Math.min(investmentRatio * 60, 30);

  return Math.round(
    Math.max(
      0,
      Math.min(100, score)
    )
  );
}

const HISTORY_SELECTION_KEY = "aia:selected-history";

export function saveSelectedHistoryRecord(record) {
  if (typeof window === "undefined") return;

  if (!record) {
    localStorage.removeItem(HISTORY_SELECTION_KEY);
    return;
  }

  localStorage.setItem(HISTORY_SELECTION_KEY, JSON.stringify(record));
}

export function loadSelectedHistoryRecord() {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(HISTORY_SELECTION_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}