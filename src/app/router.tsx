import { createBrowserRouter } from "react-router-dom"
import { RootLayout } from "@/components/layout/root-layout"
import { AppLayout } from "@/components/layout/app-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminGuard } from "@/components/auth/role-guard"
import { LandingPage } from "@/pages/landing"
import { LoginPage } from "@/pages/login"
import { RegisterPage } from "@/pages/register"
import { DashboardPage } from "@/pages/dashboard"
import { ReservationsPage } from "@/pages/reservations"
import { DesksPage } from "@/pages/desks"
import { FloorsPage } from "@/pages/floors"
import { FloorDetailPage } from "@/pages/floor-detail"
import { AdminDesksPage } from "@/pages/admin/desks"
import { AdminFloorsPage } from "@/pages/admin/floors"
import { AdminUsersPage } from "@/pages/admin/users"
import { AdminRolesPage } from "@/pages/admin/roles"
import { NotFoundPage } from "@/pages/errors/404"
import { ForbiddenPage } from "@/pages/errors/403"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "app",
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "reservations",
            element: <ReservationsPage />,
          },
          {
            path: "desks",
            element: <DesksPage />,
          },
          {
            path: "floors",
            element: <FloorsPage />,
          },
          {
            path: "floors/:floorId",
            element: <FloorDetailPage />,
          },

          {
            path: "admin",
            children: [
              {
                path: "desks",
                element: (
                  <AdminGuard>
                    <AdminDesksPage />
                  </AdminGuard>
                ),
              },
              {
                path: "floors",
                element: (
                  <AdminGuard>
                    <AdminFloorsPage />
                  </AdminGuard>
                ),
              },
              {
                path: "users",
                element: (
                  <AdminGuard>
                    <AdminUsersPage />
                  </AdminGuard>
                ),
              },
              {
                path: "roles",
                element: (
                  <AdminGuard>
                    <AdminRolesPage />
                  </AdminGuard>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "403",
        element: <ForbiddenPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
])
