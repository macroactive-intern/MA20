import { ClientStatus } from "@/app/lib/types";

const STYLES: Record<ClientStatus, string> = {
  active: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-600",
  past_due: "bg-red-100 text-red-700",
};

const LABELS: Record<ClientStatus, string> = {
  active: "Active",
  cancelled: "Cancelled",
  past_due: "Past Due",
};

export default function ClientStatusBadge({ status }: { status: ClientStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
