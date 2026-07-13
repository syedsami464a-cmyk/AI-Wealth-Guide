import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, History as HistoryIcon, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";

function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.get("/history");
        setRecords(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleDeleteRecord = async (id) => {
    try {
      setDeletingId(id);
      await api.delete(`/history/${id}`);
      setRecords((current) => current.filter((record) => record.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-primary">History</div>
            <h1 className="text-3xl font-bold tracking-tight">Your AI-generated recommendations</h1>
            <p className="mt-2 text-sm text-muted-foreground">Recent recommendations stored by the backend are shown here.</p>
          </div>
          <div className="rounded-full bg-secondary/10 p-3 text-secondary">
            <HistoryIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Loading your history...
        </div>
      ) : records.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No recommendations have been saved yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <div key={record.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Sparkles className="h-4 w-4" /> Recommendation #{record.id}
                  </div>
                  <h2 className="mt-2 text-xl font-semibold">{record.recommended_product}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {record.name} · {record.occupation} · {record.risk_level} risk
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground text-center">
                    ₹{Number(record.monthly_income || 0).toLocaleString("en-IN")} income
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-xl w-full text-destructive hover:text-destructive" onClick={() => handleDeleteRecord(record.id)} disabled={deletingId === record.id}>
                    {deletingId === record.id ? "Removing..." : "Remove"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-start">
        <Link to="/profile">
          <Button variant="outline" className="rounded-xl">Create a new plan</Button>
        </Link>
      </div>
    </div>
  );
}

export default HistoryPage;
