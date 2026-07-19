import { Client } from "@/app/lib/types";
import ClientStatusBadge from "./ClientStatusBadge";

export default function ClientList({ clients }: { clients: Client[] }) {
  if (clients.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">No clients found.</p>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {clients.map((client) => (
        <li key={client.id} className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">{client.name}</p>
            <p className="text-xs text-gray-500">{client.email}</p>
          </div>
          <ClientStatusBadge status={client.status} />
        </li>
      ))}
    </ul>
  );
}
