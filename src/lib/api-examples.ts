/**
 * API Usage Examples
 * 
 * This file demonstrates how to use the API hooks in your components.
 * All examples are commented out to avoid compilation errors.
 * 
 * Key patterns:
 * 
 * 1. Authentication:
 *    - useLoginMutation() for login
 *    - useCurrentUser() for getting current user data
 *    - useLogoutMutation() for logout
 * 
 * 2. Data Fetching:
 *    - useMyReservationsQuery() for user's reservations
 *    - useDesksQuery() for all desks
 *    - useAvailableDesksQuery() for available desks in time range
 * 
 * 3. Mutations:
 *    - useCreateReservationMutation() for creating reservations
 *    - useCancelReservationMutation() for canceling reservations
 *    - useUpdateDeskMutation() for updating desks
 * 
 * 4. Error Handling:
 *    - All hooks return error objects with message, status, and code
 *    - Use ApiError type for proper typing
 * 
 * 5. Form Validation:
 *    - Use Zod schemas with react-hook-form
 *    - Import schemas from @/lib/schemas
 */

// Export types for easier importing
export type { ApiError } from '@/lib/api'
export type {
  LoginRequestDTO,
  RegisterRequestDTO,
  UserDTO,
} from '@/types/auth'
export type {
  ReservationResponseDTO,
  CreateReservationRequestDTO,
  UpdateReservationRequestDTO,
} from '@/types/reservation'
export type {
  DeskResponseDTO,
  CreateDeskRequestDTO,
  DeskAvailabilityRequestDTO,
} from '@/types/desk'
export type {
  FloorResponseDTO,
  CreateFloorRequestDTO,
} from '@/types/floor'
