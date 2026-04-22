import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProtectedRoute } from './ProtectedRoute'
import { useAuth } from '../providers/auth-context'

vi.mock('../providers/auth-context', () => ({
  useAuth: vi.fn(),
}))

const useAuthMock = vi.mocked(useAuth)

describe('ProtectedRoute', () => {
  it('shows loading state', () => {
    useAuthMock.mockReturnValue({
      user: { userId: '', firstName: '', lastName: '', email: '', idToken: '' },
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      signIn: vi.fn(),
      signOut: vi.fn(),
    })

    render(
      <ProtectedRoute>
        <div>secret</div>
      </ProtectedRoute>,
    )

    expect(screen.getByText('Loading authentication...')).toBeInTheDocument()
  })

  it('renders sign-in prompt for unauthenticated users', () => {
    const signIn = vi.fn()
    useAuthMock.mockReturnValue({
      user: { userId: '', firstName: '', lastName: '', email: '', idToken: '' },
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      signIn,
      signOut: vi.fn(),
    })

    render(
      <ProtectedRoute>
        <div>secret</div>
      </ProtectedRoute>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Sign in again' }))
    expect(signIn).toHaveBeenCalledTimes(1)
  })

  it('renders children when authenticated', () => {
    useAuthMock.mockReturnValue({
      user: { userId: 'u1', firstName: 'A', lastName: 'B', email: 'a@b.com', idToken: 'x' },
      accessToken: 'token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      signIn: vi.fn(),
      signOut: vi.fn(),
    })

    render(
      <ProtectedRoute>
        <div>secret</div>
      </ProtectedRoute>,
    )

    expect(screen.getByText('secret')).toBeInTheDocument()
  })
})
