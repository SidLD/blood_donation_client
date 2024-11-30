import { Calendar, ClipboardList, LogOut, CalendarPlus } from 'lucide-react'
import bloodicon from '../../../assets/logo.png'
import { Button } from "@/components/ui/button"
import logo from "../../../assets/logo.png"
import { useToast } from '@/hooks/use-toast'
import { auth } from '@/lib/services'

export default function AdminDashboard() {
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
      
    }
  }

  return (
    <div className="bg-[#3D0000] p-8 lg:p-12 flex flex-col min-h-[600px] relative">
      <div className="flex items-center justify-between text-white/90">
        <img width={80} src={logo} alt="logo" className="relative brightness-200 top-[-20px] left-[-20px]" />
        <Button 
          variant="ghost" 
          className="absolute text-white top-4 right-4 hover:bg-white/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
      <header className="flex items-center p-4">
        <h1 className="pr-8 mx-auto text-2xl font-bold text-white">
          ADMIN DASHBOARD
        </h1>
      </header>
      
      <main className="container px-4 py-12 mx-auto">
        <div className="grid max-w-4xl grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/calendar"
            className="flex flex-col items-center p-6 text-white transition-colors rounded-lg hover:bg-white/5 group"
          >
            <Calendar className="w-24 h-24 mb-4 stroke-[1.5]" />
            <span className="text-xl font-semibold">Calendar</span>
          </a>
          
          <a
            href="/admin/donor-list"
            className="flex flex-col items-center p-6 text-white transition-colors rounded-lg hover:bg-white/5 group"
          >
            <ClipboardList className="w-24 h-24 mb-4 stroke-[1.5]" />
            <span className="text-xl font-semibold">Donor List</span>
          </a>
          
          <a
            href="/admin/blood-supply"
            className="flex flex-col items-center p-4 text-white transition-colors rounded-lg hover:bg-white/5 group"
          >
              <img src={bloodicon} className="relative mb-4 w-28 h-28" />
            <span className="w-full text-xl font-semibold text-center">Blood Supply</span>
          </a>

          <a
            href="/admin/events"
            className="flex flex-col items-center p-6 text-white transition-colors rounded-lg hover:bg-white/5 group"
          >
            <CalendarPlus className="w-24 h-24 mb-4 stroke-[1.5]" />
            <span className="text-xl font-semibold text-center">Events Management</span>
          </a>
        </div>
      </main>
    </div>
  )
}

