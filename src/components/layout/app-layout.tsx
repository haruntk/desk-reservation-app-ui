import { Outlet } from 'react-router-dom'
import { TopBar } from './top-bar'
import { Sidebar } from './sidebar'

export function AppLayout() {
  return (
    <div className="flex h-screen bg-background">
      {/* Skip navigation link for screen readers */}
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <TopBar />
        
        {/* Page content */}
        <main 
          id="main-content"
          className="flex-1 overflow-y-auto bg-background p-6"
          tabIndex={-1}
          aria-label="Main content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
