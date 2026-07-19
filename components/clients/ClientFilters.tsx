interface ClientFiltersProps {
  search: string;
  status: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function ClientFilters({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onClearFilters,
}: ClientFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email"
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="sr-only">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
          <option value="past_due">Past Due</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="sort" className="sr-only">
          Sort
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Name A–Z</option>
          <option value="joined">Most Recently Joined</option>
        </select>
      </div>

      <button
        onClick={onClearFilters}
        className="text-sm text-gray-500 underline hover:text-gray-800"
      >
        Clear filters
      </button>
    </div>
  );
}
