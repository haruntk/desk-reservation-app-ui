import { createBrowserRouter, Navigate } from "react-router-dom"
import { RootLayout } from "@/components/layout/root-layout"
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
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "reservations",
            element: <div className="p-6"><h1 className="text-2xl font-bold">Reservations (Coming Soon)</h1></div>,
          },
          {
            path: "desks",
            element: <div className="p-6"><h1 className="text-2xl font-bold">Desks (Coming Soon)</h1></div>,
          },
          {
            path: "floors",
            element: <div className="p-6"><h1 className="text-2xl font-bold">Floors (Coming Soon)</h1></div>,
          },
          {
            path: "users",
            element: <div className="p-6"><h1 className="text-2xl font-bold">Users (Coming Soon)</h1></div>,
          },
          {
            path: "roles",
            element: <div className="p-6"><h1 className="text-2xl font-bold">Roles (Coming Soon)</h1></div>,
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
