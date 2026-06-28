import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Landmark } from "lucide-react";
import { fetchAnalytics, fetchTransactions, patchTransactionCategory } from "./api/client.js";
import AnalyticsBlock from "./components/AnalyticsBlock.jsx";
import TransactionStream from "./components/TransactionStream.jsx";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setError("");
    const [transactionPayload, analyticsPayload] = await Promise.all([
      fetchTransactions(),
      fetchAnalytics()
    ]);

    setTransactions(transactionPayload.data);
    setCategories(transactionPayload.meta.categories);
    setAnalytics(analyticsPayload.data);
  }, []);

  useEffect(() => {
    loadDashboard()
      .catch((loadError) => setError(loadError.message))
      .finally(() => setIsLoading(false));
  }, [loadDashboard]);

  async function handleCategoryChange(transactionId, category) {
    setUpdatingId(transactionId);
    setError("");

    try {
      const payload = await patchTransactionCategory(transactionId, category);
      setTransactions(payload.data.transactions);
      setAnalytics(payload.data.analytics);
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
          <span className="grid size-10 place-items-center rounded-lg bg-slate-950 text-white">
            <Landmark size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-500">The Bank Transaction</p>
            <p className="text-lg font-bold text-slate-950">UPI Summary & Categorization App</p>
          </div>
        </div>
      </header>

      {analytics && <AnalyticsBlock analytics={analytics} />}

      {error && (
        <div className="mx-auto mt-4 flex max-w-6xl items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle size={17} aria-hidden="true" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm font-medium text-slate-500">Loading...</div>
      ) : (
        <TransactionStream
          categories={categories}
          transactions={transactions}
          updatingId={updatingId}
          onCategoryChange={handleCategoryChange}
        />
      )}
    </div>
  );
}
