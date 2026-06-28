import { CATEGORY_BUDGETS, CATEGORIES } from "../config/categories.js";

function createEmptyCategoryMetric(category) {
  return {
    category,
    total: 0,
    cap: CATEGORY_BUDGETS[category],
    progressPercent: 0,
    flowType: category === "Salary" ? "credit" : "debit"
  };
}

export function reduceAnalytics(parsedTransactions) {
  const metricMap = new Map(
    CATEGORIES.map((category) => [category, createEmptyCategoryMetric(category)])
  );

  const totals = parsedTransactions.reduce(
    (accumulator, transaction) => {
      if (transaction.direction === "credit") {
        accumulator.incoming += transaction.amount;
      } else {
        accumulator.outgoing += transaction.amount;
      }

      const metric = metricMap.get(transaction.category);
      if (!metric) {
        return accumulator;
      }

      if (metric.flowType === transaction.direction) {
        metric.total += transaction.amount;
      }

      return accumulator;
    },
    { incoming: 0, outgoing: 0 }
  );

  const categoryMetrics = Array.from(metricMap.values()).map((metric) => ({
    ...metric,
    total: Number(metric.total.toFixed(2)),
    progressPercent: Math.min(100, Math.round((metric.total / metric.cap) * 100))
  }));

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      incoming: Number(totals.incoming.toFixed(2)),
      outgoing: Number(totals.outgoing.toFixed(2)),
      net: Number((totals.incoming - totals.outgoing).toFixed(2))
    },
    categories: categoryMetrics
  };
}
