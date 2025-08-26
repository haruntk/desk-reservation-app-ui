import * as React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  ArrowRight, 
  Calendar, 
  Monitor, 
  MapPin,
  Users,
  Clock,
  Shield
} from "lucide-react"
import { 
  Button, 
  Card, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui"

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
  React.useEffect(() => {
    // Set document title for accessibility and SEO
    document.title = "Desk Reservation System"
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
            Smart Desk Reservation
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Transform your workspace management with our intelligent desk reservation system. 
            Reserve desks, manage floors, and optimize office space effortlessly.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="gap-2">
                <Link to="/login" aria-label="Get started with desk reservation">
                  Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="outline" size="lg">
                <Link to="/register" aria-label="Create new account">
                  Sign Up Free
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        variants={itemVariants}
        className="py-16"
        aria-labelledby="features-title"
      >
        <div className="text-center mb-12">
          <motion.h2 
            id="features-title"
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Why Choose DeskSpace?
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            Streamline your office management with powerful features designed for modern workplaces
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Calendar,
              title: "Easy Scheduling",
              description: "Book desks instantly with our intuitive calendar interface. View availability in real-time.",
              delay: 1.2
            },
            {
              icon: MapPin,
              title: "Floor Planning", 
              description: "Interactive floor maps show desk locations and availability at a glance. Navigate with ease.",
              delay: 1.4
            },
            {
              icon: Users,
              title: "Team Management",
              description: "Manage user roles, permissions, and team reservations effortlessly from one dashboard.",
              delay: 1.6
            },
            {
              icon: Clock,
              title: "Real-time Updates",
              description: "Get instant notifications about reservation changes and availability updates.",
              delay: 1.8
            },
            {
              icon: Shield,
              title: "Secure & Reliable",
              description: "Enterprise-grade security with role-based access control and data protection.",
              delay: 2.0
            },
            {
              icon: Monitor,
              title: "Modern Interface",
              description: "Clean, responsive design that works seamlessly across all devices and platforms.",
              delay: 2.2
            }
          ].map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay, duration: 0.5 }}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <feature.icon 
                      className="h-12 w-12 text-primary mx-auto mb-4" 
                      aria-hidden="true"
                    />
                  </motion.div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>


    </motion.div>
  )
}
