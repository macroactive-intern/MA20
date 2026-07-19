"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function ClientListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  void searchParams;
  void router;
  void pathname;

  return <div />;
}
