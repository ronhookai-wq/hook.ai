import React from 'react'
import { useAuth } from '../components/auth/AuthProvider'
import { Navigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../components/ui/card'

export function Generate() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Generate Thumbnails</h1>
          <p className="mt-2 text-gray-600">Create stunning AI-powered thumbnails</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Thumbnail Generator</h2>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">
                The thumbnail generation feature is currently under development. 
                Stay tuned for updates!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}