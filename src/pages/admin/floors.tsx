import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { FloorModal } from "@/components/admin/floor-modal"
import { useFloorsQuery, useDeleteFloorMutation } from "@/features/floors/api"
import type { FloorResponseDTO } from "@/types/floor"

export function AdminFloorsPage() {
  const [selectedFloor, setSelectedFloor] = useState<FloorResponseDTO | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [floorToDelete, setFloorToDelete] = useState<FloorResponseDTO | null>(null)

  const { data: floors = [], isLoading, refetch } = useFloorsQuery()
  const deleteMutation = useDeleteFloorMutation()

  const handleEdit = (floor: FloorResponseDTO) => {
    setSelectedFloor(floor)
    setShowEditModal(true)
  }

  const handleDelete = (floor: FloorResponseDTO) => {
    setFloorToDelete(floor)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!floorToDelete) return

    try {
      await deleteMutation.mutateAsync(floorToDelete.floorId)
      toast.success("Floor deleted successfully!")
      setShowDeleteDialog(false)
      setFloorToDelete(null)
    } catch (error) {
      toast.error("Failed to delete floor")
      console.error("Delete floor error:", error)
    }
  }

  const handleModalSuccess = () => {
    refetch()
  }

  const columns: DataTableColumn<FloorResponseDTO>[] = [
    {
      key: "floorId",
      header: "ID",
      sortable: true,
    },
    {
      key: "floorNumber",
      header: "Floor Number",
      sortable: true,
    },
    {
      key: "deskCount",
      header: "Total Desks",
      sortable: true,
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      searchable: false,
      render: (floor) => format(new Date(floor.createdAt), "MMM d, yyyy"),
    },
  ]

  const renderActions = (floor: FloorResponseDTO) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(floor)}
      >
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDelete(floor)}
        disabled={floor.deskCount > 0}
        title={floor.deskCount > 0 ? "Cannot delete floor with existing desks" : "Delete floor"}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Floor Management</h1>
        <p className="text-muted-foreground">
          Manage office floors and their desk allocations.
        </p>
      </div>

      <DataTable
        data={floors}
        columns={columns}
        isLoading={isLoading}
        title="All Floors"
        searchPlaceholder="Search floors by number..."
        actions={renderActions}
        onAdd={() => setShowCreateModal(true)}
        addButtonText="Add New Floor"
        itemsPerPage={15}
      />

      {/* Create Modal */}
      <FloorModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleModalSuccess}
      />

      {/* Edit Modal */}
      <FloorModal
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open)
          if (!open) setSelectedFloor(null)
        }}
        floor={selectedFloor || undefined}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Floor"
        description={
          floorToDelete?.deskCount === 0
            ? `Are you sure you want to delete Floor ${floorToDelete?.floorNumber}? This action cannot be undone.`
            : `Cannot delete Floor ${floorToDelete?.floorNumber} because it has ${floorToDelete?.deskCount} desks. Please remove all desks first.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
