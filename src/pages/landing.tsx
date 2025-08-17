import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6 max-w-2xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
          Hello Desk Reservation
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Reserve your perfect workspace with ease. Manage desks, floors, and bookings all in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/login">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/register">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
