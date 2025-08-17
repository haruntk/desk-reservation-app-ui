import { Toaster as HotToaster } from 'react-hot-toast'
import { useTheme } from '@/app/theme-provider'

export function Toaster() {
  const { theme } = useTheme()

  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: theme === 'dark' ? 'hsl(var(--card))' : 'hsl(var(--card))',
          color: theme === 'dark' ? 'hsl(var(--card-foreground))' : 'hsl(var(--card-foreground))',
          border: '1px solid hsl(var(--border))',
        },
        success: {
          iconTheme: {
            primary: 'hsl(var(--primary))',
            secondary: 'white',
          },
        },
        error: {
          iconTheme: {
            primary: 'hsl(var(--destructive))',
            secondary: 'white',
          },
        },
      }}
    />
  )
}
