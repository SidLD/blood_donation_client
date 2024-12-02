import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { getCurrentUser, updateUserSettings } from '@/lib/api'

interface UserData {
  donorId: string;
  status: string;
  name: string;
  email: string;
}

export default function UserSettings() {
  const [userData] = useState<UserData | null>(null)
  const [status, setStatus] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const data = await getCurrentUser()
        // setUserData(data)
        // setStatus(data.status)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      })
      return
    }

    try {
    //   await updateUserSettings({
    //     status,
    //     currentPassword,
    //     newPassword: newPassword || undefined,
    //   })
      toast({
        title: "Settings Updated",
        description: "Your user settings have been successfully updated.",
      })
      // Reset password fields
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="text-white">Loading user data...</div>
  }

//   if (!userData) {
//     return <div className="text-white">Error: Unable to load user data.</div>
//   }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="mb-4 text-2xl font-bold text-white">User Settings</h2>
      
      <div>
        <Label htmlFor="donorId" className="text-white">Donor ID</Label>
        <Input
          id="donorId"
          value={userData?.donorId}
          className="text-white bg-white/10"
          disabled
        />
      </div>

      <div>
        <Label htmlFor="name" className="text-white">Name</Label>
        <Input
          id="name"
          value={userData?.name}
          className="text-white bg-white/10"
          disabled
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input
          id="email"
          value={userData?.email}
          className="text-white bg-white/10"
          disabled
        />
      </div>

      <div>
        <Label htmlFor="status" className="text-white">Status</Label>
        <Select onValueChange={setStatus} value={status}>
          <SelectTrigger className="text-white bg-white/10">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="text-white bg-white/10"
          placeholder="Enter current password"
        />
      </div>

      <div>
        <Label htmlFor="newPassword" className="text-white">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="text-white bg-white/10"
          placeholder="Enter new password"
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="text-white bg-white/10"
          placeholder="Confirm new password"
        />
      </div>

      <Button type="submit" className="w-full">
        Update Settings
      </Button>
    </form>
  )
}

