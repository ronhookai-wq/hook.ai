import React from 'react'
import { useAuth } from '../components/auth/AuthProvider'
import { SubscriptionStatus } from '../components/subscription/SubscriptionStatus'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'

export function Dashboard() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.email}</span>
              <Button onClick={signOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <SubscriptionStatus />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/pricing">View All Plans</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/generate">Generate Thumbnails</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}