import type { ReactNode } from 'react'
import { useAuth } from '../providers/auth-context'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, signIn } = useAuth()

  if (isLoading) {
    return <p className="text-slate-600">Loading authentication...</p>
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-md bg-amber-50 p-4 text-amber-900 ring-1 ring-amber-200">
        <p className="mb-3">Your session is not authenticated.</p>
        <button
          className="rounded-md bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-500"
          onClick={() => void signIn()}
          type="button"
        >
          Sign in again
        </button>
      </div>
    )
  }

  return <>{children}</>
}
