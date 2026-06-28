import { BriefcaseBusiness, CarFront, CircleHelp, Utensils } from "lucide-react";

const iconMap = {
  "Food & Dining": Utensils,
  Travel: CarFront,
  Salary: BriefcaseBusiness,
  Miscellaneous: CircleHelp
};

const colorMap = {
  "Food & Dining": "bg-rose-500",
  Travel: "bg-sky-500",
  Salary: "bg-emerald-500",
  Miscellaneous: "bg-amber-500"
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export default function AnalyticsBlock({ analytics }) {
  const categories = analytics?.categories || [];

  return (
    <section className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((metric) => {
          const Icon = iconMap[metric.category] || CircleHelp;
          const barColor = colorMap[metric.category] || "bg-slate-500";

          return (
            <div key={metric.category} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-700">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{metric.category}</p>
                    <p className="text-xs text-slate-500">{metric.progressPercent}% of cap</p>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-bold text-slate-950">{formatCurrency(metric.total)}</p>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${barColor}`}
                  style={{ width: `${metric.progressPercent}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>{metric.flowType === "credit" ? "Inflow" : "Spend"}</span>
                <span>{formatCurrency(metric.cap)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
