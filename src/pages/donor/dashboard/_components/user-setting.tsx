'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { getDonorSetting, updateDonorSetting, updateDonorPassword } from '@/lib/api'

const settingsSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  status: z.boolean(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SettingsFormValues = z.infer<typeof settingsSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export default function UserSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      email: '',
      status: true,
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await getDonorSetting() as unknown as any
        settingsForm.reset({
          email: data.email,
          status: data.status === 'ACTIVE',
        })
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
  }, [toast, settingsForm])

  const onSettingsSubmit = async (data: SettingsFormValues) => {
    try {
      await updateDonorSetting({
        ...data,
        status: data.status ? 'ACTIVE' : 'INACTIVE',
      })
      toast({
        title: "Settings Updated",
        description: "Your user settings have been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      await updateDonorPassword(data)
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      })
      passwordForm.reset()
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="text-white">Loading user data...</div>
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/10">
        <CardContent>
          <Form {...settingsForm}>
            <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-2">
              <FormField
                control={settingsForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="mt-2 text-white bg-white/10"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={settingsForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-white">
                        Account Status
                      </FormLabel>
                      <div className="text-sm text-white/70">
                        {field.value ? 'ACTIVE' : 'INACTIVE'}
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Update Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-white/10">
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-2">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Current Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="text-white bg-white/10"
                        placeholder="Enter current password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="text-white bg-white/10"
                        placeholder="Enter new password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="text-white bg-white/10"
                        placeholder="Confirm new password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Update Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

