import { ArrowDownLeft, ArrowUpRight, Gift, Tag } from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function formatTime(value) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short"
  }).format(new Date(value));
}

export default function TransactionCard({ categories, transaction, onCategoryChange, isUpdating }) {
  const isCredit = transaction.direction === "credit";
  const DirectionIcon = isCredit ? ArrowDownLeft : ArrowUpRight;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span
            className={`mt-1 grid size-10 shrink-0 place-items-center rounded-lg ${
              isCredit ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            <DirectionIcon size={19} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-base font-semibold text-slate-950">{transaction.description}</p>
            <p className="mt-1 text-sm text-slate-500">{formatTime(transaction.occurredAt)}</p>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{transaction.rawText}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:items-end">
          <p className={`text-lg font-bold ${isCredit ? "text-emerald-700" : "text-rose-700"}`}>
            {isCredit ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <Tag size={15} aria-hidden="true" />
            <select
              className="bg-transparent font-medium outline-none disabled:cursor-wait disabled:opacity-60"
              value={transaction.category}
              disabled={isUpdating}
              onChange={(event) => onCategoryChange(transaction.id, event.target.value)}
              aria-label={`Category for ${transaction.description}`}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {transaction.metadata?.isSavingsEligible && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-100">
            <Gift size={17} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">Expected Savings</p>
            <p className="text-sm">
              {transaction.metadata.projectedRewardPoints} points at{" "}
              {Math.round(transaction.metadata.projectedRewardRate * 100)}%
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
