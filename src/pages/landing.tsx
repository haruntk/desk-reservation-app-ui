import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Monitor } from "lucide-react"
import { Button } from "@/components/ui"
import { useAuth } from "@/features/auth/store"

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24
    }
  }
}

export function LandingPage() {
  const { isAuthenticated, user } = useAuth()

  React.useEffect(() => {
    // Set document title for accessibility and SEO
    document.title = "Desk Reservation"
  }, [])

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 py-8"
    >
      {/* Hero Section */}
      <motion.section 
        variants={itemVariants}
        className="text-center py-16"
        aria-labelledby="hero-title"
      >
        <div className="max-w-3xl mx-auto">
          <motion.h1 
            id="hero-title"
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            Desk Reservation
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Reserve desks, manage floors, and optimize office space effortlessly.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {isAuthenticated ? (
              // Giriş yapmış kullanıcı için
              <motion.div className="flex flex-col sm:flex-row gap-4 items-center">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/app" aria-label="Go to Dashboard">
                      <Monitor className="h-4 w-4" aria-hidden="true" />
                      Go to Dashboard
                    </Link>
                  </Button>
                </motion.div>
                <motion.p 
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Welcome back, {user?.userName || 'User'}!
                </motion.p>
              </motion.div>
            ) : (
              // Giriş yapmamış kullanıcı için
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="gap-2">
                  <Link to="/login" aria-label="Sign in with Windows Authentication">
                    <Monitor className="h-4 w-4" aria-hidden="true" />
                    Sign In with Windows
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>


    </motion.div>
  )
}
