import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '@/services/api'

interface AuthState {
  token: string | null
  role: string | null
  username: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      role: null,
      username: null,

      login: async (username, password) => {
        const { data } = await apiClient.login(username, password)
        localStorage.setItem('cf_token', data.access_token)
        set({
          token: data.access_token,
          role: data.role,
          username,
        })
      },

      logout: () => {
        localStorage.removeItem('cf_token')
        set({ token: null, role: null, username: null })
      },

      isAuthenticated: () => !!get().token,
    }),
    {
<<<<<<< HEAD
      name: 'cleanflow-auth',
=======
      name: 'salonewaterwatch-auth',
>>>>>>> origin/rename-salone-water-watch-6798015821729430602
      partialize: (s) => ({
        token: s.token,
        role: s.role,
        username: s.username,
      }),
    },
  ),
)
