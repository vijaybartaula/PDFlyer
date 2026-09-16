"use client"

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient, type User, type SupabaseClient } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const supabase: SupabaseClient | null = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      try {
        return createClient(url, key)
      } catch (e) {
        console.warn("Could not initialize Supabase client:", e)
      }
    }
    return null
  }, [])

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false)
      return
    }

    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (e) {
        console.warn("Error getting session:", e)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [supabase])

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      console.warn("Supabase is not configured.")
      return
    }
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/api/auth/callback` : undefined,
        },
      })
      if (error) throw error
      setUser(data.user)
      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      console.warn("Supabase is not configured.")
      return
    }
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      setUser(data.user)
      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    if (!supabase) {
      setUser(null)
      router.push("/")
      return
    }
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    return {
      user: null,
      isLoading: false,
      signUp: async () => {},
      signIn: async () => {},
      signOut: async () => {},
    }
  }
  return context
}
