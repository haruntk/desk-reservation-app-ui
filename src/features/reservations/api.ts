import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

import type { 
  ReservationResponseDTO,
  CreateReservationRequestDTO,
  UpdateReservationRequestDTO,
  UpdateReservationStatusRequestDTO,
  ReservationFilters,
  UserReservationsResponseDTO
} from '@/types/reservation'

// API endpoints
const RESERVATION_ENDPOINTS = {
  GET_ALL: '/reservation/get-all',
  GET_BY_ID: (id: number) => `/reservation/get/${id}`,
  MY_RESERVATIONS: '/reservation/my-reservations',
  BY_DESK: (deskId: number) => `/reservation/desk/${deskId}`,
  ACTIVE: '/reservation/active',
  PAST: '/reservation/past',
  UPCOMING: '/reservation/upcoming',
  CREATE: '/reservation/create',
  UPDATE: (id: number) => `/reservation/update/${id}`,
  UPDATE_STATUS: (id: number) => `/reservation/${id}/status`,
  CANCEL: (id: number) => `/reservation/${id}/cancel`,
  DELETE: (id: number) => `/reservation/${id}/delete`,
} as const

// Query keys
export const reservationKeys = {
  all: ['reservations'] as const,
  lists: () => [...reservationKeys.all, 'list'] as const,
  list: (filters: ReservationFilters) => [...reservationKeys.lists(), filters] as const,
  details: () => [...reservationKeys.all, 'detail'] as const,
  detail: (id: number) => [...reservationKeys.details(), id] as const,
  my: () => [...reservationKeys.all, 'my'] as const,
  byDesk: (deskId: number) => [...reservationKeys.all, 'desk', deskId] as const,
  active: () => [...reservationKeys.all, 'active'] as const,
  past: () => [...reservationKeys.all, 'past'] as const,
  upcoming: () => [...reservationKeys.all, 'upcoming'] as const,
}

// Reservations API functions
export const reservationsApi = {
  // Get all reservations (admin/teamlead only)
  getAll: async (): Promise<ReservationResponseDTO[]> => {
    const response = await apiClient.get<ReservationResponseDTO[]>(RESERVATION_ENDPOINTS.GET_ALL)
    return response.data
  },

  // Get reservation by ID
  getById: async (id: number): Promise<ReservationResponseDTO> => {
    const response = await apiClient.get<ReservationResponseDTO>(RESERVATION_ENDPOINTS.GET_BY_ID(id))
    return response.data
  },

  // Get current user's reservations
  getMyReservations: async (): Promise<ReservationResponseDTO[]> => {
    const response = await apiClient.get<UserReservationsResponseDTO>(RESERVATION_ENDPOINTS.MY_RESERVATIONS)
    // Combine all reservation types into a single array
    const allReservations = [
      ...response.data.activeReservations,
      ...response.data.upcomingReservations,
      ...response.data.pastReservations,
    ]
    return allReservations
  },

  // Get reservations by desk ID
  getByDeskId: async (deskId: number): Promise<ReservationResponseDTO[]> => {
    const response = await apiClient.get<ReservationResponseDTO[]>(RESERVATION_ENDPOINTS.BY_DESK(deskId))
    return response.data
  },

  // Get active reservations
  getActive: async (): Promise<ReservationResponseDTO[]> => {
    const response = await apiClient.get<ReservationResponseDTO[]>(RESERVATION_ENDPOINTS.ACTIVE)
    return response.data
  },

  // Get past reservations
  getPast: async (): Promise<ReservationResponseDTO[]> => {
    const response = await apiClient.get<ReservationResponseDTO[]>(RESERVATION_ENDPOINTS.PAST)
    return response.data
  },

  // Get upcoming reservations
  getUpcoming: async (): Promise<ReservationResponseDTO[]> => {
    const response = await apiClient.get<ReservationResponseDTO[]>(RESERVATION_ENDPOINTS.UPCOMING)
    return response.data
  },

  // Create reservation
  create: async (data: CreateReservationRequestDTO): Promise<number> => {
    const response = await apiClient.post(RESERVATION_ENDPOINTS.CREATE, data)
    // Extract reservation ID from the Location header or response
    return response.status === 201 ? 1 : 0 // Backend returns 201 with location header
  },

  // Update reservation
  update: async (id: number, data: UpdateReservationRequestDTO): Promise<void> => {
    await apiClient.put(RESERVATION_ENDPOINTS.UPDATE(id), data)
  },

  // Update reservation status
  updateStatus: async (id: number, data: UpdateReservationStatusRequestDTO): Promise<void> => {
    await apiClient.patch(RESERVATION_ENDPOINTS.UPDATE_STATUS(id), data)
  },

  // Cancel reservation
  cancel: async (id: number): Promise<void> => {
    await apiClient.post(RESERVATION_ENDPOINTS.CANCEL(id))
  },

  // Delete reservation (admin only)
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(RESERVATION_ENDPOINTS.DELETE(id))
  },
}

// React Query hooks

// Get all reservations (admin/teamlead)
export const useReservationsQuery = () => {
  return useQuery({
    queryKey: reservationKeys.lists(),
    queryFn: reservationsApi.getAll,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Get reservation by ID
export const useReservationQuery = (id: number) => {
  return useQuery({
    queryKey: reservationKeys.detail(id),
    queryFn: () => reservationsApi.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Get current user's reservations
export const useMyReservationsQuery = () => {
  return useQuery({
    queryKey: reservationKeys.my(),
    queryFn: reservationsApi.getMyReservations,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Get reservations by desk
export const useReservationsByDeskQuery = (deskId: number) => {
  return useQuery({
    queryKey: reservationKeys.byDesk(deskId),
    queryFn: () => reservationsApi.getByDeskId(deskId),
    enabled: !!deskId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Get active reservations
export const useActiveReservationsQuery = () => {
  return useQuery({
    queryKey: reservationKeys.active(),
    queryFn: reservationsApi.getActive,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Get past reservations
export const usePastReservationsQuery = () => {
  return useQuery({
    queryKey: reservationKeys.past(),
    queryFn: reservationsApi.getPast,
    staleTime: 60 * 1000, // 1 minute (past data changes less frequently)
  })
}

// Get upcoming reservations
export const useUpcomingReservationsQuery = () => {
  return useQuery({
    queryKey: reservationKeys.upcoming(),
    queryFn: reservationsApi.getUpcoming,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Create reservation mutation
export const useCreateReservationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reservationsApi.create,
    onMutate: async (newReservation) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: reservationKeys.my() })

      // Snapshot previous value
      const previousReservations = queryClient.getQueryData<ReservationResponseDTO[]>(reservationKeys.my())

      // Optimistically update to the new value
      if (previousReservations) {
        const optimisticReservation: ReservationResponseDTO = {
          reservationId: Date.now(), // Temporary ID
          userId: 'current-user', // This should come from auth context
          deskId: newReservation.deskId,
          deskName: 'Loading...', // Will be updated after success
          floorNumber: 0, // Will be updated after success
          startTime: newReservation.startTime,
          endTime: newReservation.endTime,
          status: 'Active',
          createdAt: new Date().toISOString(),
          duration: 'Calculating...',
          isActive: false,
          isPast: false,
          isUpcoming: true,
        }

        queryClient.setQueryData<ReservationResponseDTO[]>(
          reservationKeys.my(),
          [...previousReservations, optimisticReservation]
        )
      }

      return { previousReservations }
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousReservations) {
        queryClient.setQueryData(reservationKeys.my(), context.previousReservations)
      }
    },
    onSuccess: () => {
      // Invalidate and refetch reservation queries to get accurate data
      queryClient.invalidateQueries({ queryKey: reservationKeys.all })
    },
  })
}

// Update reservation mutation
export const useUpdateReservationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReservationRequestDTO }) =>
      reservationsApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific reservation and lists
      queryClient.invalidateQueries({ queryKey: reservationKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() })
    },
  })
}

// Update reservation status mutation
export const useUpdateReservationStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReservationStatusRequestDTO }) =>
      reservationsApi.updateStatus(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific reservation and lists
      queryClient.invalidateQueries({ queryKey: reservationKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() })
    },
  })
}

// Cancel reservation mutation
export const useCancelReservationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reservationsApi.cancel,
    onMutate: async (reservationId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: reservationKeys.my() })

      // Snapshot previous value
      const previousReservations = queryClient.getQueryData<ReservationResponseDTO[]>(reservationKeys.my())

      // Optimistically update to cancelled status
      if (previousReservations) {
        const updatedReservations = previousReservations.map(reservation =>
          reservation.reservationId === reservationId
            ? { ...reservation, status: 'Cancelled' as const }
            : reservation
        )

        queryClient.setQueryData<ReservationResponseDTO[]>(
          reservationKeys.my(),
          updatedReservations
        )
      }

      return { previousReservations }
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousReservations) {
        queryClient.setQueryData(reservationKeys.my(), context.previousReservations)
      }
    },
    onSuccess: (_, id) => {
      // Invalidate specific reservation and lists to get accurate data
      queryClient.invalidateQueries({ queryKey: reservationKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() })
    },
  })
}

// Delete reservation mutation (admin only)
export const useDeleteReservationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reservationsApi.delete,
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: reservationKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() })
    },
  })
}
