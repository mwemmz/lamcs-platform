import { ReactNode } from "react";

type Tone = "success" | "pending" | "info" | "danger" | "neutral";

const tones: Record<Tone, string> = {
  success: "bg-avocado-flesh/25 text-avocado-skin",
  pending: "bg-pit/15 text-pit",
  info: "bg-avocado-skin/15 text-avocado-skin",
  danger: "bg-red-500/15 text-red-700",
  neutral: "bg-surface-2 text-ink-soft",
};

const toneLabels: Partial<Record<Tone, string>> = {
  success: "Active",
  pending: "Pending",
  info: "Info",
  danger: "Action needed",
  neutral: "—",
};

export function StatusBadge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  const s = status.toUpperCase();
  if (["PAID", "ACTIVE", "COMPLETED", "SUCCESS"].includes(s)) return "success";
  if (["PENDING", "CONFIRMED"].includes(s)) return "pending";
  if (["DISPATCHED"].includes(s)) return "info";
  if (["FAILED", "CANCELLED"].includes(s)) return "danger";
  return "neutral";
}

export { toneLabels };
