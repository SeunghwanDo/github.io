'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/lib/supabase'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: SupabaseUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  }
}

// Assessment saving hook
export function useAssessment() {
  const { user } = useAuth()

  const saveAssessment = async (scores: Record<string, number>, averageScore: number) => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
      console.log('Assessment saved locally (Supabase not configured)')
      // Store in localStorage as fallback
      const assessment = {
        id: Date.now().toString(),
        scores,
        average_score: averageScore,
        created_at: new Date().toISOString(),
      }
      const existing = JSON.parse(localStorage.getItem('assessments') || '[]')
      existing.push(assessment)
      localStorage.setItem('assessments', JSON.stringify(existing))
      return { data: assessment, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('skill_assessments')
        .insert({
          user_id: user?.id || null,
          scores,
          average_score: averageScore,
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  const getAssessments = async () => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
      const existing = JSON.parse(localStorage.getItem('assessments') || '[]')
      return { data: existing, error: null }
    }

    if (!user) {
      return { data: [], error: null }
    }

    try {
      const { data, error } = await supabase
        .from('skill_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  return { saveAssessment, getAssessments }
}
