import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, User, Wallet, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { defaultProfile, saveProfile } from "@/lib/profile-store";
import { cn } from "@/lib/utils";
import api from "@/services/api";

const steps = [
  { icon: User, title: "Personal Information" },
  { icon: Wallet, title: "Financial Details" },
  { icon: Target, title: "Investment Details" },
];

function ProfilePage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  const [data, setData] = useState(defaultProfile);

  const update = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNumber = (key, value) => {
    if (value === "") {
      update(key, "");
      return;
    }

    const parsed = Number(value);
    update(key, Number.isNaN(parsed) ? "" : parsed);
  };

  const submit = async () => {
    try {
      const monthlyIncome = Number(data.monthlyIncome || 0);
      const monthlyExpenses = Number(data.monthlyExpenses || 0);

      const response = await api.post("/recommend", {
        name: "User",
        age: Number(data.age || 0),
        occupation: data.occupation,
        monthly_income: monthlyIncome,
        monthly_savings: monthlyIncome - monthlyExpenses,
        investment_goal: data.goal,
        risk_level: data.risk,
      });

      saveProfile({
        ...data,
        recommendation: response.data,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to backend.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Build your investment profile
        </h1>

        <p className="mt-2 text-muted-foreground">
          A few quick questions to tailor your plan.
        </p>
      </div>

      <div className="flex items-center justify-between mb-8 gap-2">
        {steps.map((item, index) => (
          <div key={item.title} className="flex-1 flex items-center gap-2">
            <div
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full font-semibold text-sm",
                index < step
                  ? "bg-secondary text-secondary-foreground"
                  : index === step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index < step ? <Check className="h-4 w-4" /> : index + 1}
            </div>

            <div className="hidden sm:block">
              <div className="text-xs text-muted-foreground">
                Step {index + 1}
              </div>

              <div className="text-sm font-medium">{item.title}</div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 rounded",
                  index < step ? "bg-secondary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6 sm:p-8">

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
          >

            {step === 0 && (
              <div className="grid gap-5 sm:grid-cols-2">

                <Field label="Age">
                  <Input
                    type="number"
                    value={data.age ?? ""}
                    onChange={(e) =>
                      updateNumber("age", e.target.value)
                    }
                  />
                </Field>

                <Field label="Occupation">
                  <Input
                    value={data.occupation}
                    onChange={(e) =>
                      update("occupation", e.target.value)
                    }
                  />
                </Field>

                <Field label="Annual Income (₹)">
                  <Input
                    type="number"
                    value={data.annualIncome ?? ""}
                    onChange={(e) =>
                      updateNumber("annualIncome", e.target.value)
                    }
                  />
                </Field>

                <Field label="Monthly Income (₹)">
                  <Input
                    type="number"
                    value={data.monthlyIncome ?? ""}
                    onChange={(e) =>
                      updateNumber("monthlyIncome", e.target.value)
                    }
                  />
                </Field>

                <Field label="Monthly Expenses (₹)" full>
                  <Input
                    type="number"
                    value={data.monthlyExpenses ?? ""}
                    onChange={(e) =>
                      updateNumber("monthlyExpenses", e.target.value)
                    }
                  />
                </Field>

              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">

                <Field label="Current Savings (₹)">
                  <Input
                    type="number"
                    value={data.currentSavings ?? ""}
                    onChange={(e) =>
                      updateNumber("currentSavings", e.target.value)
                    }
                  />
                </Field>

                <Field label="Existing Investments (₹)">
                  <Input
                    type="number"
                    value={data.existingInvestments ?? ""}
                    onChange={(e) =>
                      updateNumber(
                        "existingInvestments",
                        e.target.value
                      )
                    }
                  />
                </Field>

                <Field label="Emergency Fund (₹)" full>
                  <Input
                    type="number"
                    value={data.emergencyFund ?? ""}
                    onChange={(e) =>
                      updateNumber("emergencyFund", e.target.value)
                    }
                  />
                </Field>

              </div>
            )}

            {step === 2 && (
              <div className="grid gap-5">

                <Field label="Financial Goal">
                  <Select
                    value={data.goal}
                    onValueChange={(v) => update("goal", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {[
                        "Wealth Creation",
                        "Retirement",
                        "Child Education",
                        "House Purchase",
                        "Emergency Fund",
                        "Tax Saving",
                      ].map((goal) => (
                        <SelectItem key={goal} value={goal}>
                          {goal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Investment Duration">
                  <Select
                    value={data.duration}
                    onValueChange={(v) => update("duration", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {[
                        "1–3 Years",
                        "3–5 Years",
                        "5–10 Years",
                        "10+ Years",
                      ].map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Risk Appetite">
                  <RadioGroup
                    value={data.risk}
                    onValueChange={(v) => update("risk", v)}
                    className="grid grid-cols-3 gap-3"
                  >
                    {["Low", "Medium", "High"].map((risk) => (
                      <label
                        key={risk}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-xl border p-4",
                          data.risk === risk
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted"
                        )}
                      >
                        <RadioGroupItem value={risk} />
                        <span>{risk}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </Field>

              </div>
            )}

          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between">

          <Button
            variant="outline"
            disabled={step === 0}
            onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((prev) => prev + 1)}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={submit}>
              Generate Investment Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

        </div>
      </div>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={cn("space-y-2", full && "sm:col-span-2")}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export default ProfilePage;