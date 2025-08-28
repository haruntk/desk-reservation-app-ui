import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Monitor, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuth } from '@/features/auth/store'
import { useLoginMutation } from '@/features/auth'

import type { ApiError } from '@/lib/api'

export function WindowsLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [autoAuthAttempted, setAutoAuthAttempted] = React.useState(false)
  
  const loginMutation = useLoginMutation()
  
  // Get the intended destination from location state, default to /app
  const from = location.state?.from?.pathname || '/app'

  const handleWindowsLogin = async () => {
    try {
      // For Windows Authentication, just call the login endpoint
      const userData = await loginMutation.mutateAsync()
      
      // Store the user data in our auth store (no token needed)
      login(userData)
      
      toast.success('Windows Authentication successful!')
      navigate(from, { replace: true })
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.message || 'Windows Authentication failed')
    }
  }

  // Attempt automatic Windows Authentication on page load
  React.useEffect(() => {
    if (!autoAuthAttempted) {
      setAutoAuthAttempted(true)
      handleWindowsLogin()
    }
  }, [autoAuthAttempted])

  React.useEffect(() => {
    document.title = "Windows Sign In - Desk Reservation"
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Monitor className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
Desk Reservation
            </span>
          </motion.div>
          
          <ThemeToggle />
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Card className="border border-border/50 bg-card/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="space-y-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg"
              >
                <Monitor className="h-6 w-6 text-primary-foreground" />
              </motion.div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Windows Authentication
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Sign in using your Windows domain account
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="text-center space-y-2 bg-muted/30 rounded-lg p-4">
                    <div className="h-8 w-8 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <Monitor className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {loginMutation.isPending 
                        ? "Attempting automatic Windows authentication..." 
                        : "Automatic authentication failed. Click the button below to try again."}
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={handleWindowsLogin}
                      className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl text-base font-medium" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <Monitor className="mr-2 h-5 w-5" />
                          Sign in with Windows
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
