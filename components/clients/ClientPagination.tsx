interface ClientPaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function ClientPagination({
  currentPage,
  lastPage,
  total,
  onPrevious,
  onNext,
}: ClientPaginationProps) {
  return (
    <div className="flex items-center justify-between pt-2">
      <button
        onClick={onPrevious}
        disabled={currentPage <= 1}
        className="rounded border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm text-gray-500">
        Page {currentPage} of {lastPage}
        <span className="ml-2">({total} clients)</span>
      </span>
      <button
        onClick={onNext}
        disabled={currentPage >= lastPage}
        className="rounded border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
