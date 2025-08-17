import { createBrowserRouter, Navigate } from "react-router-dom"
import { RootLayout } from "@/components/layout/root-layout"
import { AppLayout } from "@/components/layout/app-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { TeamLeadOrAdminGuard, AdminGuard } from "@/components/auth/role-guard"
import { LandingPage } from "@/pages/landing"
import { LoginPage } from "@/pages/login"
import { RegisterPage } from "@/pages/register"
import { DashboardPage } from "@/pages/dashboard"

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
            element: <div className="space-y-6"><h1 className="text-3xl font-bold">My Reservations</h1><p className="text-muted-foreground">Manage your desk reservations here.</p></div>,
          },
          {
            path: "desks",
            element: <div className="space-y-6"><h1 className="text-3xl font-bold">Available Desks</h1><p className="text-muted-foreground">Browse and book available desks.</p></div>,
          },
          {
            path: "floors",
            element: (
              <TeamLeadOrAdminGuard>
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold">Floor Management</h1>
                  <p className="text-muted-foreground">Manage office floors and layouts.</p>
                </div>
              </TeamLeadOrAdminGuard>
            ),
          },
          {
            path: "users",
            element: (
              <TeamLeadOrAdminGuard>
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold">User Management</h1>
                  <p className="text-muted-foreground">Manage user accounts and permissions.</p>
                </div>
              </TeamLeadOrAdminGuard>
            ),
          },
          {
            path: "roles",
            element: (
              <AdminGuard>
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold">Role Management</h1>
                  <p className="text-muted-foreground">Manage user roles and permissions.</p>
                </div>
              </AdminGuard>
            ),
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
])
