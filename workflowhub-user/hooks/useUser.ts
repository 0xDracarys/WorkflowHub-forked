import { useState, useEffect, useCallback } from 'react'
import { UserProfile, UserStats, UserActivity, UserSearchFilters, UserSearchResult } from '../types'
import { WorkflowHubUserAPI } from '../lib'
import { mockUserStats, mockUserActivity } from '../lib/mock-data'

export function useUser(userId?: string) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await WorkflowHubUserAPI.getUserProfile(id)
      if (response.success) {
        setUser(response.data || null)
      } else {
        setError(response.error || 'Failed to fetch user')
        setUser(null)
      }
    } catch (err) {
      setError('Network error occurred')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      fetchUser(userId)
    }
  }, [userId, fetchUser])

  const updateUser = async (updateData: Partial<UserProfile>) => {
    if (!userId) return { success: false, error: 'No user ID provided' }
    
    setLoading(true)
    try {
      const response = await WorkflowHubUserAPI.updateUserProfile(userId, updateData)
      if (response.success) {
        setUser(response.data || null)
      }
      return response
    } catch (err) {
      return { success: false, error: 'Network error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (isOnline: boolean) => {
    if (!userId) return { success: false, error: 'No user ID provided' }
    
    try {
      const response = await WorkflowHubUserAPI.updateUserStatus(userId, isOnline)
      if (response.success && user) {
        setUser({
          ...user,
          isOnline,
          lastActiveAt: new Date()
        })
      }
      return response
    } catch (err) {
      return { success: false, error: 'Network error occurred' }
    }
  }

  return {
    user,
    loading,
    error,
    updateUser,
    updateStatus,
    refetch: () => userId ? fetchUser(userId) : Promise.resolve()
  }
}

export function useUserStats(userId?: string) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Use mock data for demo
      setTimeout(() => {
        setStats(mockUserStats)
        setLoading(false)
      }, 500)
    } catch (err) {
      setError('Network error occurred')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      fetchStats(userId)
    }
  }, [userId, fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: () => userId ? fetchStats(userId) : Promise.resolve()
  }
}

export function useUserActivity(userId?: string, limit: number = 20) {
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActivity = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await WorkflowHubUserAPI.getUserActivity(id, limit)
      if (response.success) {
        setActivities(response.data || [])
      } else {
        setError(response.error || 'Failed to fetch user activity')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    if (userId) {
      fetchActivity(userId)
    }
  }, [userId, fetchActivity])

  return {
    activities,
    loading,
    error,
    refetch: () => userId ? fetchActivity(userId) : Promise.resolve()
  }
}

export function useUserSearch() {
  const [results, setResults] = useState<UserSearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchUsers = async (filters: UserSearchFilters, page: number = 1, limit: number = 20) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await WorkflowHubUserAPI.searchUsers(filters, { page, limit })
      if (response.success) {
        setResults(response.data || null)
      } else {
        setError(response.error || 'Search failed')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults(null)
    setError(null)
  }

  return {
    results,
    loading,
    error,
    searchUsers,
    clearResults
  }
}

export function useFeaturedInfluencers(limit: number = 10) {
  const [influencers, setInfluencers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedInfluencers = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await WorkflowHubUserAPI.getFeaturedInfluencers(limit)
      if (response.success) {
        setInfluencers(response.data || [])
      } else {
        setError(response.error || 'Failed to fetch featured influencers')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchFeaturedInfluencers()
  }, [fetchFeaturedInfluencers])

  return {
    influencers,
    loading,
    error,
    refetch: fetchFeaturedInfluencers
  }
}

export function useUserVerification() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifyUser = async (userId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await WorkflowHubUserAPI.verifyUser(userId)
      if (!response.success) {
        setError(response.error || 'Verification failed')
      }
      return response
    } catch (err) {
      setError('Network error occurred')
      return { success: false, error: 'Network error occurred' }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    verifyUser
  }
}

export function useInfluencerProfile() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateInfluencerProfile = async (userId: string, profileData: UserProfile['influencerProfile']) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await WorkflowHubUserAPI.updateInfluencerProfile(userId, profileData)
      if (!response.success) {
        setError(response.error || 'Profile update failed')
      }
      return response
    } catch (err) {
      setError('Network error occurred')
      return { success: false, error: 'Network error occurred' }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    updateInfluencerProfile
  }
}

export function useProviderProfile() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateProviderProfile = async (userId: string, profileData: UserProfile['providerProfile']) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await WorkflowHubUserAPI.updateProviderProfile(userId, profileData)
      if (!response.success) {
        setError(response.error || 'Profile update failed')
      }
      return response
    } catch (err) {
      setError('Network error occurred')
      return { success: false, error: 'Network error occurred' }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    updateProviderProfile
  }
}
