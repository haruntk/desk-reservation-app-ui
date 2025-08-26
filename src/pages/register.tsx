import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Monitor, ArrowLeft, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ThemeToggle } from '@/components/ui/theme-toggle'

import { registerRequestSchema } from '@/lib/schemas'
import { useRegisterMutation } from '@/features/auth'

import type { RegisterRequestData } from '@/lib/schemas'
import type { RegisterRequestDTO } from '@/types/auth'
import type { ApiError } from '@/lib/api'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as any
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
}

const cardVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as any,
      delay: 0.1
    }
  }
}

export function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const navigate = useNavigate()
  
  const registerMutation = useRegisterMutation()

  const form = useForm<RegisterRequestData>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: RegisterRequestData) => {
    try {
      await registerMutation.mutateAsync(data as RegisterRequestDTO)
      
      toast.success('Account created successfully! Please sign in.')
      navigate('/login')
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.message || 'Registration failed')
    }
  }

  React.useEffect(() => {
    document.title = "Sign Up - DeskSpace"
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                <Monitor className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                DeskSpace
              </span>
            </Link>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle variant="compact" />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link to="/" aria-label="Back to homepage">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md">
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
          >
            <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="space-y-4 text-center pb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                  className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg"
                >
                  <UserPlus className="h-6 w-6 text-primary-foreground" />
                </motion.div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Create an account
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Sign up to start reserving desks
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Email</FormLabel>
                          <FormControl>
                            <motion.div
                              whileFocus={{ scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                              <Input
                                placeholder="john.doe@example.com"
                                type="email"
                                autoComplete="email"
                                className="h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                                {...field}
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Password</FormLabel>
                          <FormControl>
                            <motion.div
                              whileFocus={{ scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              className="relative"
                            >
                              <Input
                                placeholder="Create a password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                className="h-11 pr-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                                {...field}
                              />
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-0 top-0 h-11 flex items-center"
                              >
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-accent/50"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </motion.div>
                            </motion.div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="pt-2"
                    >
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl" 
                        disabled={registerMutation.isPending}
                        loading={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? 'Creating account...' : 'Create account'}
                      </Button>
                    </motion.div>
                  </form>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="relative"
                >
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                  className="text-center text-sm"
                >
                  <span className="text-muted-foreground">
                    Already have an account?{' '}
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="inline-block"
                    >
                      <Link 
                        to="/login" 
                        className="font-medium text-primary hover:text-primary/80 transition-colors duration-200 hover:underline"
                      >
                        Sign in
                      </Link>
                    </motion.span>
                  </span>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.main>
    </div>
  )
}
