import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { DeskModal } from "@/components/admin/desk-modal"
import { useDesksQuery, useDeleteDeskMutation } from "@/features/desks/api"
import type { DeskResponseDTO } from "@/types/desk"

export function AdminDesksPage() {
  const [selectedDesk, setSelectedDesk] = useState<DeskResponseDTO | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deskToDelete, setDeskToDelete] = useState<DeskResponseDTO | null>(null)

  const { data: desks = [], isLoading, refetch } = useDesksQuery()
  const deleteMutation = useDeleteDeskMutation()

  const handleEdit = (desk: DeskResponseDTO) => {
    setSelectedDesk(desk)
    setShowEditModal(true)
  }

  const handleDelete = (desk: DeskResponseDTO) => {
    setDeskToDelete(desk)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deskToDelete) return

    try {
      await deleteMutation.mutateAsync(deskToDelete.deskId)
      toast.success("Desk deleted successfully!")
      setShowDeleteDialog(false)
      setDeskToDelete(null)
    } catch (error) {
      toast.error("Failed to delete desk")
      console.error("Delete desk error:", error)
    }
  }

  const handleModalSuccess = () => {
    refetch()
  }

  const columns: DataTableColumn<DeskResponseDTO>[] = [
    {
      key: "deskId",
      header: "ID",
      sortable: true,
    },
    {
      key: "deskName",
      header: "Desk Name",
      sortable: true,
    },
    {
      key: "floorNumber",
      header: "Floor",
      sortable: true,
      render: (desk) => `Floor ${desk.floorNumber}`,
    },
    {
      key: "isAvailable",
      header: "Status",
      sortable: true,
      searchable: false,
      render: (desk) => (
        <Badge variant={desk.isAvailable ? "success" : "destructive"}>
          {desk.isAvailable ? "Available" : "Occupied"}
        </Badge>
      ),
    },
    {
      key: "nextReservationStart",
      header: "Next Reservation",
      sortable: false,
      searchable: false,
      render: (desk) => 
        desk.nextReservationStart 
          ? format(new Date(desk.nextReservationStart), "MMM d, h:mm a")
          : "None",
    },
  ]

  const renderActions = (desk: DeskResponseDTO) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(desk)}
      >
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDelete(desk)}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Desk Management</h1>
        <p className="text-muted-foreground">
          Manage office desks, their locations, and availability status.
        </p>
      </div>

      <DataTable
        data={desks}
        columns={columns}
        isLoading={isLoading}
        title="All Desks"
        searchPlaceholder="Search desks by name or floor..."
        actions={renderActions}
        onAdd={() => setShowCreateModal(true)}
        addButtonText="Add New Desk"
        itemsPerPage={15}
      />

      {/* Create Modal */}
      <DeskModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleModalSuccess}
      />

      {/* Edit Modal */}
      <DeskModal
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open)
          if (!open) setSelectedDesk(null)
        }}
        desk={selectedDesk || undefined}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Desk"
        description={`Are you sure you want to delete "${deskToDelete?.deskName}"? This action cannot be undone and will affect any existing reservations.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
