import { Link } from 'react-router-dom'
import { Shield, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth, useAuthRoles } from '@/features/auth/store'

export function ForbiddenPage() {
  const { user } = useAuth()
  const { getUserRoles } = useAuthRoles()

  const userRoles = getUserRoles()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <Shield className="h-10 w-10 text-destructive" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don't have the required permissions to access this resource. Please contact your administrator if you believe this is an error.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-6xl font-bold text-muted-foreground/50" aria-hidden="true">
            403
          </div>
          
          {user && (
            <div className="rounded-lg bg-muted p-3 text-sm">
              <div className="font-medium mb-2">Current User:</div>
              <div className="space-y-1">
                <div><strong>Email:</strong> {user.email}</div>
                <div className="flex items-center gap-2">
                  <strong>Roles:</strong>
                  {userRoles.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {userRoles.map((role) => (
                        <Badge key={role} variant="outline" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No roles assigned</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link to="/app" aria-label="Go to dashboard">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
