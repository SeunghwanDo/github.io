'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import {
  JobPosting,
  jobPostings,
  getJobsByCategory,
  searchJobs,
  getRecommendedCoursesForJob,
  calculateJobMatchScore,
} from '@/data/jobs'
import { courses } from '@/data/courses'

interface UseJobsOptions {
  category?: string
  search?: string
}

export function useJobs(options: UseJobsOptions = {}) {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)
        setError(null)

        // Check if Supabase is configured (for future real API integration)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
          // Use local mock data
          let filteredJobs: JobPosting[]

          if (options.search) {
            filteredJobs = searchJobs(options.search)
          } else if (options.category && options.category !== '전체') {
            filteredJobs = getJobsByCategory(options.category)
          } else {
            filteredJobs = Object.values(jobPostings)
          }

          // Apply both filters if both exist
          if (options.search && options.category && options.category !== '전체') {
            const categoryJobs = getJobsByCategory(options.category)
            filteredJobs = filteredJobs.filter((job) =>
              categoryJobs.some((cj) => cj.id === job.id)
            )
          }

          setJobs(filteredJobs)
          return
        }

        // Future: Fetch from Biz360 API via Supabase Edge Function
        // const { data, error: fetchError } = await supabase.functions.invoke('biz360-jobs', {
        //   body: { category: options.category, search: options.search }
        // })

        // For now, use mock data
        setJobs(Object.values(jobPostings))
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setError('채용공고를 불러오는데 실패했습니다.')
        setJobs(Object.values(jobPostings))
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [options.category, options.search])

  return { jobs, loading, error }
}

export function useJob(id: string) {
  const [job, setJob] = useState<JobPosting | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recommendedCourses, setRecommendedCourses] = useState<typeof courses[keyof typeof courses][]>([])

  useEffect(() => {
    async function fetchJob() {
      try {
        setLoading(true)
        setError(null)

        const jobData = jobPostings[id]
        if (!jobData) {
          setError('채용공고를 찾을 수 없습니다.')
          return
        }

        setJob(jobData)

        // Get recommended courses for this job
        const courseIds = getRecommendedCoursesForJob(jobData)
        const recommended = courseIds
          .map((cid) => courses[cid])
          .filter(Boolean)
        setRecommendedCourses(recommended)
      } catch (err) {
        console.error('Error fetching job:', err)
        setError('채용공고를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchJob()
    }
  }, [id])

  return { job, loading, error, recommendedCourses }
}

// Hook for job matching based on user skills
export function useJobMatching() {
  const { user } = useAuth()
  const [matchedJobs, setMatchedJobs] = useState<
    Array<{
      job: JobPosting
      score: number
      matchedRequired: string[]
      matchedPreferred: string[]
      missingRequired: string[]
      recommendedCourses: string[]
    }>
  >([])
  const [loading, setLoading] = useState(true)

  const calculateMatches = useCallback(
    async (userSkills: string[]) => {
      setLoading(true)
      try {
        const jobs = Object.values(jobPostings)
        const matches = jobs
          .map((job) => {
            const matchResult = calculateJobMatchScore(userSkills, job)
            const recommendedCourseIds = matchResult.missingRequired.length > 0
              ? getRecommendedCoursesForJob({
                  ...job,
                  required_skills: matchResult.missingRequired,
                  preferred_skills: [],
                })
              : []

            return {
              job,
              ...matchResult,
              recommendedCourses: recommendedCourseIds,
            }
          })
          .filter((match) => match.score > 0)
          .sort((a, b) => b.score - a.score)

        setMatchedJobs(matches)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Auto-calculate when user assessment data is available
  useEffect(() => {
    const fetchUserSkills = async () => {
      // Try to get user's assessment results from localStorage
      const assessmentData = localStorage.getItem('assessmentResults')
      if (assessmentData) {
        try {
          const results = JSON.parse(assessmentData)
          // Extract skills from assessment (skills with score >= 3)
          const userSkills = Object.entries(results)
            .filter(([, score]) => (score as number) >= 3)
            .map(([skill]) => skill)

          if (userSkills.length > 0) {
            calculateMatches(userSkills)
            return
          }
        } catch (e) {
          console.error('Failed to parse assessment data:', e)
        }
      }

      // Default: show all jobs with 0 match score
      setMatchedJobs(
        Object.values(jobPostings).map((job) => ({
          job,
          score: 0,
          matchedRequired: [],
          matchedPreferred: [],
          missingRequired: job.required_skills,
          recommendedCourses: getRecommendedCoursesForJob(job),
        }))
      )
      setLoading(false)
    }

    fetchUserSkills()
  }, [calculateMatches])

  return { matchedJobs, loading, calculateMatches }
}

// Hook for saving/bookmarking jobs
export function useSavedJobs() {
  const { user } = useAuth()
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]')
    setSavedJobs(saved)
    setLoading(false)
  }, [])

  const saveJob = useCallback((jobId: string) => {
    setSavedJobs((prev) => {
      if (prev.includes(jobId)) return prev
      const updated = [...prev, jobId]
      localStorage.setItem('savedJobs', JSON.stringify(updated))
      return updated
    })
  }, [])

  const unsaveJob = useCallback((jobId: string) => {
    setSavedJobs((prev) => {
      const updated = prev.filter((id) => id !== jobId)
      localStorage.setItem('savedJobs', JSON.stringify(updated))
      return updated
    })
  }, [])

  const isJobSaved = useCallback(
    (jobId: string) => savedJobs.includes(jobId),
    [savedJobs]
  )

  const getSavedJobsList = useCallback(() => {
    return savedJobs.map((id) => jobPostings[id]).filter(Boolean)
  }, [savedJobs])

  return { savedJobs, loading, saveJob, unsaveJob, isJobSaved, getSavedJobsList }
}
