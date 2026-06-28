import { CATEGORY_RULES, REWARD_KEYWORDS } from "../config/categories.js";

const CREDIT_HINTS = ["received", "credited", "credit", "deposited"];
const DEBIT_HINTS = ["paid", "sent", "debited", "debit", "spent", "purchase"];

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function extractAmount(rawText) {
  const amountMatch = rawText.match(/(?:rs\.?|inr)\s*([0-9,]+(?:\.[0-9]{1,2})?)/i);
  if (!amountMatch) {
    return 0;
  }

  return Number(amountMatch[1].replace(/,/g, ""));
}

function inferDirection(rawText) {
  const lower = rawText.toLowerCase();
  const isCredit = CREDIT_HINTS.some((hint) => lower.includes(hint));
  const isDebit = DEBIT_HINTS.some((hint) => lower.includes(hint));

  if (isCredit && !isDebit) {
    return "credit";
  }

  return "debit";
}

function inferCategory(rawText) {
  const lower = rawText.toLowerCase();
  const matchedRule = CATEGORY_RULES.find((rule) =>
    rule.keywords.some((keyword) => lower.includes(keyword))
  );

  return matchedRule?.category || "Miscellaneous";
}

function extractCounterparty(rawText, direction) {
  const preposition = direction === "credit" ? "from" : "to";
  const pattern = new RegExp(`${preposition}\\s+(.+?)(?:\\s+(?:via|ref|for|order|salary|offer)|\\.|$)`, "i");
  const match = rawText.match(pattern);

  if (!match) {
    return direction === "credit" ? "Unknown sender" : "Unknown payee";
  }

  return match[1].trim();
}

function buildDescription(direction, amount, counterparty) {
  const formattedAmount = new Intl.NumberFormat("en-IN").format(amount);
  const verb = direction === "credit" ? "Received" : "Paid";
  const preposition = direction === "credit" ? "from" : "to";

  return `${verb} Rs. ${formattedAmount} ${preposition} ${counterparty}`;
}

function buildRewardsMetadata(rawText, direction, amount) {
  const lower = rawText.toLowerCase();
  const hasRewardSignal = REWARD_KEYWORDS.some((keyword) => lower.includes(keyword));

  if (direction !== "debit" || !hasRewardSignal || amount <= 0) {
    return {
      isSavingsEligible: false,
      projectedRewardRate: 0,
      projectedRewardPoints: 0
    };
  }

  return {
    isSavingsEligible: true,
    projectedRewardRate: 0.05,
    projectedRewardPoints: Math.round(amount * 0.05)
  };
}

export function parseTransaction(transaction) {
  const rawText = normalizeText(transaction.rawText);
  const amount = extractAmount(rawText);
  const direction = inferDirection(rawText);
  const category = transaction.manualCategory || inferCategory(rawText);
  const counterparty = extractCounterparty(rawText, direction);
  const signedAmount = direction === "credit" ? amount : -amount;
  const metadata = buildRewardsMetadata(rawText, direction, amount);

  return {
    id: transaction.id,
    occurredAt: transaction.occurredAt,
    rawText,
    description: buildDescription(direction, amount, counterparty),
    counterparty,
    direction,
    amount,
    signedAmount,
    category,
    parserCategory: inferCategory(rawText),
    manualCategory: transaction.manualCategory || null,
    metadata
  };
}
