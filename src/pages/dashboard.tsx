export function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">My Reservations</h2>
          <p className="text-gray-600 dark:text-gray-300">View and manage your desk reservations</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Available Desks</h2>
          <p className="text-gray-600 dark:text-gray-300">Find and book available workspaces</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Floor Plans</h2>
          <p className="text-gray-600 dark:text-gray-300">Browse office layouts and desk locations</p>
        </div>
      </div>
    </div>
  )
}
