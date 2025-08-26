import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TopBar } from './top-bar'
import { Sidebar } from './sidebar'
import React from 'react'

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
}

export function AppLayout() {
  const location = useLocation()
  const [isNavigating, setIsNavigating] = React.useState(false)

  // Handle navigation state changes
  React.useEffect(() => {
    setIsNavigating(true)
    const timer = setTimeout(() => {
      setIsNavigating(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <TopBar />
        
        {/* Page content */}
        <main 
          id="main-content"
          className="flex-1 overflow-y-auto bg-background relative"
          tabIndex={-1}
          aria-label="Main content"
        >
          <AnimatePresence mode="wait" onExitComplete={() => setIsNavigating(false)}>
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="w-full min-h-full"
            >
              {/* Fallback loading state during navigation */}
              {isNavigating && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                </div>
              )}
              
              <div className="p-6 scrollbar-thin">
                <React.Suspense 
                  fallback={
                    <div className="flex items-center justify-center min-h-[50vh]">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading page...</p>
                      </div>
                    </div>
                  }
                >
                  <Outlet />
                </React.Suspense>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
