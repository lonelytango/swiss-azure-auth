import { createContext, useContext } from 'react'

export interface UserData {
  userId: string
  firstName: string
  lastName: string
  email: string
  idToken: string
}

export interface AuthContextValue {
  user: UserData
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }
  return context
}
