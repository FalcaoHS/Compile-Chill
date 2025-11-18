"use client"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null
  }

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page, last page, and pages around current
      pages.push(1)

      if (currentPage > 3) {
        pages.push("...")
      }

      // Pages around current page
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push("...")
      }

      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className={`
          px-4 py-2
          rounded-lg
          text-sm font-medium
          transition-all duration-200
          ${
            canGoPrevious
              ? "bg-page-secondary text-text border-2 border-border hover:border-primary hover:text-primary"
              : "bg-page text-text-secondary border-2 border-border cursor-not-allowed opacity-50"
          }
          focus:outline-none focus:ring-2 focus:ring-primary
        `}
        aria-label="Página anterior"
      >
        ← Anterior
      </button>

      {/* Page Numbers */}
      <div className="hidden sm:flex items-center gap-2">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-text-secondary">
                ...
              </span>
            )
          }

          const pageNum = page as number
          const isActive = pageNum === currentPage

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`
                w-10 h-10
                rounded-lg
                text-sm font-bold
                transition-all duration-200
                ${
                  isActive
                    ? "bg-primary text-page shadow-glow-sm"
                    : "bg-page-secondary text-text border-2 border-border hover:border-primary hover:text-primary"
                }
                focus:outline-none focus:ring-2 focus:ring-primary
              `}
              aria-label={`Página ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          )
        })}
      </div>

      {/* Mobile Page Info */}
      <div className="sm:hidden px-4 py-2 bg-page-secondary border-2 border-border rounded-lg">
        <span className="text-sm font-medium text-text">
          {currentPage} / {totalPages}
        </span>
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={`
          px-4 py-2
          rounded-lg
          text-sm font-medium
          transition-all duration-200
          ${
            canGoNext
              ? "bg-page-secondary text-text border-2 border-border hover:border-primary hover:text-primary"
              : "bg-page text-text-secondary border-2 border-border cursor-not-allowed opacity-50"
          }
          focus:outline-none focus:ring-2 focus:ring-primary
        `}
        aria-label="Próxima página"
      >
        Próxima →
      </button>
    </div>
  )
}

