import TransactionCard from "./TransactionCard.jsx";

export default function TransactionStream({ categories, transactions, onCategoryChange, updatingId }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-normal text-slate-950">UPI Transaction Stream</h1>
          <p className="mt-1 text-sm text-slate-500">Recent bank alerts</p>
        </div>
      </div>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            categories={categories}
            transaction={transaction}
            isUpdating={updatingId === transaction.id}
            onCategoryChange={onCategoryChange}
          />
        ))}
      </div>
    </main>
  );
}
