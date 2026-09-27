import { statusLabel } from "@/lib/format";

const tone: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-900",
  CONFIRMED: "bg-sky-100 text-sky-900",
  IN_PRODUCTION: "bg-indigo text-paper",
  READY: "bg-emerald-100 text-emerald-900",
  SHIPPED: "bg-emerald-100 text-emerald-900",
  DELIVERED: "bg-ink text-paper",
  CANCELLED: "bg-line text-stone",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-block whitespace-nowrap px-2 py-0.5 text-xs font-semibold ${tone[status] ?? ""}`}>{statusLabel[status] ?? status}</span>;
}
