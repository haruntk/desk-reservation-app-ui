import { RouterProvider } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "@/app/theme-provider"
import { queryClient } from "@/app/query-client"
import { router } from "@/app/router"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { ErrorBoundary } from "@/components/error-boundary"
import { useAuthCheck } from "@/hooks/use-auth-check"

function AppContent() {
  useAuthCheck() // Check Windows Authentication status on app start
  
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      <SonnerToaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="desk-reservation-theme">
          <AppContent />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
