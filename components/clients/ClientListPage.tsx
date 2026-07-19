"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ClientFilters from "./ClientFilters";
import ClientList from "./ClientList";
import ClientListSkeleton from "./ClientListSkeleton";
import type { Client } from "@/app/lib/types";

const DEBOUNCE_MS = 300;

export default function ClientListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Refs prevent stale closures inside the debounce timer callback
  const searchParamsRef = useRef(searchParams);
  const routerRef = useRef(router);
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    searchParamsRef.current = searchParams;
    routerRef.current = router;
    pathnameRef.current = pathname;
  });

  // --- Read URL values with safe defaults ---
  const urlSearch = searchParams.get("search") ?? "";
  const urlStatus = searchParams.get("status") ?? "";
  const urlSort = searchParams.get("sort") ?? "name";
  const urlPage = (() => {
    const p = parseInt(searchParams.get("page") ?? "1", 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  })();

  // Temporary local state: only the text currently visible in the search
  // input while the 300 ms debounce is running. The URL remains the
  // canonical applied filter state and drives the SWR key.
  const [inputSearch, setInputSearch] = useState(urlSearch);

  // Keep the input in sync with the URL (Back, Forward, Clear filters)
  useEffect(() => {
    setInputSearch(urlSearch);
  }, [urlSearch]);

  // --- Query-update helpers ---

  function buildFilterUrl(overrides: Record<string, string | null>): string {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    params.delete("page");
    for (const [key, value] of Object.entries(overrides)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const qs = params.toString();
    return qs ? `${pathnameRef.current}?${qs}` : pathnameRef.current;
  }

  function buildPageUrl(page: number): string {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `${pathnameRef.current}?${qs}` : pathnameRef.current;
  }

  // --- Search debounce ---
  useEffect(() => {
    const id = setTimeout(() => {
      const currentSearch = searchParamsRef.current.get("search") ?? "";
      if (inputSearch === currentSearch) return;
      routerRef.current.replace(
        buildFilterUrl({ search: inputSearch || null })
      );
    }, DEBOUNCE_MS);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputSearch]);

  // --- Filter handlers ---

  function handleStatusChange(value: string) {
    router.replace(buildFilterUrl({ status: value || null }));
  }

  function handleSortChange(value: string) {
    router.replace(buildFilterUrl({ sort: value === "name" ? null : value }));
  }

  function handleClearFilters() {
    setInputSearch("");
    router.replace(pathname);
  }

  void urlPage;
  void buildPageUrl;

  // TODO Step 10: replace with SWR data
  const clients: Client[] = [];
  const isLoading = false; // TODO Step 10: from useSWR

  return (
    <div className="space-y-4">
      <ClientFilters
        search={inputSearch}
        status={urlStatus}
        sort={urlSort}
        onSearchChange={setInputSearch}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
      />
      {isLoading ? <ClientListSkeleton /> : <ClientList clients={clients} />}
    </div>
  );
}
