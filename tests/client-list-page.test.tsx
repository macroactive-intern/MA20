import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import ClientListPage from "@/components/clients/ClientListPage";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock("swr", () => ({
  default: vi.fn(),
}));

const mockReplace = vi.fn();
const mockPush = vi.fn();

function makeSwrResult(currentPage: number, lastPage: number) {
  return {
    data: {
      data: [],
      meta: {
        current_page: currentPage,
        last_page: lastPage,
        total: lastPage * 10,
        per_page: 10,
      },
    },
    error: undefined,
    isLoading: false,
  };
}

function setupMocks(
  params: Record<string, string> = {},
  swrResult = makeSwrResult(1, 1)
) {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams(params) as ReturnType<typeof useSearchParams>
  );
  vi.mocked(useRouter).mockReturnValue({
    replace: mockReplace,
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  });
  vi.mocked(usePathname).mockReturnValue("/clients");
  vi.mocked(useSWR).mockReturnValue(swrResult as ReturnType<typeof useSWR>);
}

beforeEach(() => {
  vi.clearAllMocks();
  setupMocks();
});

// ─── Search debounce ────────────────────────────────────────────────────────

describe("search debounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("updates the URL with the typed value after 300 ms", async () => {
    render(<ClientListPage />);
    const input = screen.getByRole("textbox", { name: /search/i });

    await act(async () => { fireEvent.change(input, { target: { value: "john" } }); });
    await act(async () => { vi.advanceTimersByTime(300); });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("search=john")
    );
  });

  it("does not update the URL before 300 ms have elapsed", async () => {
    render(<ClientListPage />);
    const input = screen.getByRole("textbox", { name: /search/i });

    await act(async () => { fireEvent.change(input, { target: { value: "alice" } }); });
    await act(async () => { vi.advanceTimersByTime(200); });

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("fires only once after rapid keystrokes", async () => {
    render(<ClientListPage />);
    const input = screen.getByRole("textbox", { name: /search/i });

    await act(async () => { fireEvent.change(input, { target: { value: "j" } }); });
    await act(async () => { fireEvent.change(input, { target: { value: "jo" } }); });
    await act(async () => { fireEvent.change(input, { target: { value: "john" } }); });
    await act(async () => { vi.advanceTimersByTime(300); });

    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("search=john")
    );
  });
});

// ─── Clear filters ───────────────────────────────────────────────────────────

describe("Clear filters", () => {
  it("navigates to /clients with no query string", async () => {
    setupMocks({ search: "alice", status: "active", sort: "joined", page: "2" });
    const user = userEvent.setup();
    render(<ClientListPage />);

    await user.click(screen.getByRole("button", { name: /clear filters/i }));

    expect(mockReplace).toHaveBeenCalledWith("/clients");
  });
});

// ─── Status filter ───────────────────────────────────────────────────────────

describe("status filter", () => {
  it("updates the URL immediately on change", async () => {
    const user = userEvent.setup();
    render(<ClientListPage />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: /status/i }),
      "active"
    );

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("status=active")
    );
  });

  it("uses router.replace, not router.push", async () => {
    const user = userEvent.setup();
    render(<ClientListPage />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: /status/i }),
      "active"
    );

    expect(mockReplace).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("resets the page to 1 (removes page param) on change", async () => {
    setupMocks({ page: "3" });
    const user = userEvent.setup();
    render(<ClientListPage />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: /status/i }),
      "active"
    );

    const url: string = mockReplace.mock.calls[0][0];
    expect(url).not.toMatch(/page=/);
  });
});

// ─── Sort filter ─────────────────────────────────────────────────────────────

describe("sort filter", () => {
  it("updates the URL immediately on change", async () => {
    const user = userEvent.setup();
    render(<ClientListPage />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: /sort/i }),
      "joined"
    );

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("sort=joined")
    );
  });

  it("resets the page to 1 (removes page param) on change", async () => {
    setupMocks({ page: "2" });
    const user = userEvent.setup();
    render(<ClientListPage />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: /sort/i }),
      "joined"
    );

    const url: string = mockReplace.mock.calls[0][0];
    expect(url).not.toMatch(/page=/);
  });
});

// ─── Pagination ──────────────────────────────────────────────────────────────

describe("pagination", () => {
  it("uses router.push when clicking Next", async () => {
    setupMocks({ page: "1" }, makeSwrResult(1, 3));
    const user = userEvent.setup();
    render(<ClientListPage />);

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("page=2"));
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("uses router.push when clicking Previous", async () => {
    setupMocks({ page: "2" }, makeSwrResult(2, 3));
    const user = userEvent.setup();
    render(<ClientListPage />);

    await user.click(screen.getByRole("button", { name: /previous/i }));

    expect(mockPush).toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
    // page 1 is the default — the param is omitted, not set to "1"
    expect(mockPush.mock.calls[0][0]).not.toMatch(/page=/);
  });

  it("disables the Previous button on page 1", () => {
    setupMocks({ page: "1" }, makeSwrResult(1, 3));
    render(<ClientListPage />);

    const btn = screen.getByRole("button", { name: /previous/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it("disables the Next button on the last page", () => {
    setupMocks({ page: "3" }, makeSwrResult(3, 3));
    render(<ClientListPage />);

    const btn = screen.getByRole("button", { name: /next/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});

// ─── URL → input sync ────────────────────────────────────────────────────────

describe("URL → input sync", () => {
  it("populates the search input from the URL on render", () => {
    setupMocks({ search: "bob" });
    render(<ClientListPage />);

    const input = screen.getByRole("textbox", { name: /search/i }) as HTMLInputElement;
    expect(input.value).toBe("bob");
  });
});

// ─── SWR cache key ───────────────────────────────────────────────────────────

describe("SWR cache key", () => {
  it("includes all active filter and page values", () => {
    setupMocks({
      search: "bob",
      status: "cancelled",
      sort: "joined",
      page: "2",
    });
    render(<ClientListPage />);

    const key = vi.mocked(useSWR).mock.calls[0][0] as string;
    expect(key).toContain("search=bob");
    expect(key).toContain("status=cancelled");
    expect(key).toContain("sort=joined");
    expect(key).toContain("page=2");
  });
});
