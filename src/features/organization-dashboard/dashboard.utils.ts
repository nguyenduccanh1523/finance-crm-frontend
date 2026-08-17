export function formatMoney(amountCents: string, currency: string) {
  const amount = Number(amountCents) / 100;
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  }).format(safeAmount);
}

export function formatChartAmount(value: number, currency: string) {
  const amount = value / 100;
  if (Math.abs(amount) >= 1_000_000)
    return `${(amount / 1_000_000).toFixed(1)}M`;
  if (Math.abs(amount) >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDueDate(value: string | null) {
  if (!value) return "Chưa đặt hạn";
  const dueDate = new Date(value);
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const startOfDueDate = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate(),
  );
  const dayDifference = Math.round(
    (startOfDueDate.getTime() - startOfToday.getTime()) / 86_400_000,
  );

  if (dayDifference === 0) return "Hôm nay";
  if (dayDifference === 1) return "Ngày mai";
  if (dayDifference < 0) return "Quá hạn";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  }).format(dueDate);
}
