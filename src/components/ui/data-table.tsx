import { useState } from "react"
import { ChevronLeft, ChevronRight, Search, Database } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { TableSkeleton } from "@/components/ui/loading"

export interface DataTableColumn<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
  searchable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  isLoading?: boolean
  title?: string
  searchPlaceholder?: string
  itemsPerPage?: number
  actions?: (item: T) => React.ReactNode
  onAdd?: () => void
  addButtonText?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  title,
  searchPlaceholder = "Search...",
  itemsPerPage = 10,
  actions,
  onAdd,
  addButtonText = "Add New",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true
    
    return columns.some((column) => {
      if (column.searchable === false) return false
      
      const value = item[column.key as keyof T]
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    })
  })

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  if (isLoading) {
    return <TableSkeleton rows={itemsPerPage} columns={columns.length} />
  }

  return (
    <Card>
      {title && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            {onAdd && (
              <Button onClick={onAdd}>
                {addButtonText}
              </Button>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page when searching
              }}
              className="max-w-sm"
              aria-label="Search table data"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key as string}
                        className={`px-4 py-3 text-left text-sm font-medium ${
                          column.sortable !== false ? "cursor-pointer hover:bg-muted" : ""
                        }`}
                        onClick={() => {
                          if (column.sortable !== false) {
                            handleSort(column.key as string)
                          }
                        }}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.header}</span>
                          {column.sortable !== false && sortColumn === column.key && (
                            <span className="text-xs">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                    {actions && (
                      <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + (actions ? 1 : 0)} className="p-0">
                        <EmptyState
                          icon={<Database className="h-8 w-8 text-muted-foreground" />}
                          title={searchTerm ? "No results found" : "No data available"}
                          description={
                            searchTerm 
                              ? `No items match "${searchTerm}". Try adjusting your search.`
                              : "There are no items to display at the moment."
                          }
                          action={
                            searchTerm ? {
                              label: "Clear search",
                              onClick: () => setSearchTerm(""),
                              variant: "outline"
                            } : onAdd ? {
                              label: addButtonText,
                              onClick: onAdd
                            } : undefined
                          }
                          className="border-0 shadow-none"
                        />
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        {columns.map((column) => (
                          <td key={column.key as string} className="px-4 py-3 text-sm">
                            {column.render
                              ? column.render(item)
                              : item[column.key as keyof T]?.toString() || "-"}
                          </td>
                        ))}
                        {actions && (
                          <td className="px-4 py-3 text-right">
                            {actions(item)}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2">...</span>
                    }
                    return null
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
