import { Suspense } from "react";
import ClientListPage from "@/components/clients/ClientListPage";
import ClientListSkeleton from "@/components/clients/ClientListSkeleton";

export default function ClientsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Clients</h1>
      <Suspense fallback={<ClientListSkeleton />}>
        <ClientListPage />
      </Suspense>
    </main>
  );
}
