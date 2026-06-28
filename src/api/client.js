export async function fetchTransactions() {
  const response = await fetch("/api/transactions");
  if (!response.ok) {
    throw new Error("Unable to load transactions.");
  }

  return response.json();
}

export async function fetchAnalytics() {
  const response = await fetch("/api/analytics");
  if (!response.ok) {
    throw new Error("Unable to load analytics.");
  }

  return response.json();
}

export async function patchTransactionCategory(transactionId, category) {
  const response = await fetch(`/api/transactions/${transactionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ category })
  });

  if (!response.ok) {
    throw new Error("Unable to update transaction category.");
  }

  return response.json();
}
