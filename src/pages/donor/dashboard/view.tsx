'use client'

import { useState } from 'react'
import { LogOut, Calendar, ClipboardList, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/services'
import AppointmentForm from './_components/appointment-form'
import LogsViewer from './_components/logs-viewer'
import UserSettings from './_components/user-setting'

export default function DonorDashboard() {
  const [activeTab, setActiveTab] = useState<'appointment' | 'logs' | 'settings'>('appointment')
  const { toast } = useToast()

  const handleLogout = () => {
    try {
      auth.clear()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } catch (error) {
      console.error('Logout failed:', error)
      toast({
        title: "Logout failed",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-w-full bg-[#4A1515]">
      <div className="max-w-6xl p-4 mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Donor Dashboard</h1>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </header>

        <nav className="flex mb-8 space-x-4">
          <Button
            variant={activeTab === 'appointment' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('appointment')}
            className="text-white"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Apply for Appointment
          </Button>
          <Button
            variant={activeTab === 'logs' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('logs')}
            className="text-white"
          >
            <ClipboardList className="w-5 h-5 mr-2" />
            View Logs
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('settings')}
            className="text-white"
          >
            <Settings className="w-5 h-5 mr-2" />
            User Settings
          </Button>
        </nav>

        <main className="bg-[#3D0000] rounded-lg shadow-lg p-6">
          {activeTab === 'appointment' && <AppointmentForm />}
          {activeTab === 'logs' && <LogsViewer />}
          {activeTab === 'settings' && <UserSettings />}
        </main>
      </div>
    </div>
  )
}

