import { LogIn, LogOut, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ApiError, getCurrentUser, getUserProfile } from './api/client'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './providers/auth-context'
import type { CurrentUser, UserProfile } from './types/api'

function App() {
  const { user, accessToken, error, isAuthenticated, signIn, signOut } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [needsReauth, setNeedsReauth] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!accessToken) {
        setProfile(null)
        setCurrentUser(null)
        setNeedsReauth(false)
        return
      }

      try {
        setApiError(null)
        setNeedsReauth(false)
        const [nextProfile, nextCurrentUser] = await Promise.all([
          getUserProfile(accessToken),
          getCurrentUser(accessToken),
        ])
        setProfile(nextProfile)
        setCurrentUser(nextCurrentUser)
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setNeedsReauth(true)
          setApiError('Session expired. Please sign in again.')
          return
        }
        setApiError(err instanceof Error ? err.message : 'Profile load failed.')
      }
    }

    void loadData()
  }, [accessToken])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center p-6">
      <section className="w-full rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-blue-600" />
          <h1 className="text-2xl font-semibold text-slate-900">
            Swiss Azure Auth Scaffold
          </h1>
        </div>
        {error ? <p className="mb-4 text-red-600">{error}</p> : null}
        {apiError ? <p className="mb-4 text-red-600">{apiError}</p> : null}
        {needsReauth ? (
          <button
            className="mb-4 rounded-md bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-500"
            onClick={() => void signIn()}
            type="button"
          >
            Re-authenticate
          </button>
        ) : null}

        <ProtectedRoute>
          <div className="mb-6 rounded-md bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
            <p>
              <span className="font-medium">Signed in:</span>{' '}
              {isAuthenticated ? user.email || `${user.firstName} ${user.lastName}`.trim() : 'No'}
            </p>
            <p className="mt-1">
              <span className="font-medium">Current user endpoint:</span>{' '}
              {currentUser
                ? `${currentUser.displayName} (${currentUser.email})`
                : 'Unavailable'}
            </p>
            <p className="mt-1">
              <span className="font-medium">Backend profile:</span>{' '}
              {profile ? `${profile.displayName} (${profile.tenantId})` : 'Unavailable'}
            </p>
          </div>
        </ProtectedRoute>

        <div className="flex gap-3">
          {!isAuthenticated ? (
            <button
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => void signIn()}
              type="button"
            >
              <LogIn className="h-4 w-4" />
              Sign in with Azure
            </button>
          ) : (
            <button
              className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              onClick={() => void signOut()}
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
