import { Outlet, useNavigate } from "react-router-dom"
import logo from '../assets/logo.png'
import background from '../assets/full-background.png'
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, Percent, HelpCircle, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GuestLayout() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const goToViolation=(item:any)=>{
    const url = window.location.href;
    console.log(item)
    const element =  document.getElementById(item.key)!
    element.scrollIntoView({behavior:'smooth'});
  };
  return (
    <main className="relative flex flex-col min-h-screen bg-gradient-to-t">
      <img 
        src={background} 
        alt="background"
        className="absolute inset-0 z-0 object-cover w-full h-full"
      />
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-12 shadow-lg">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-2">
                <div className="flex flex-col gap-1">
                  <div className="w-6 h-0.5 bg-black"></div>
                  <div className="w-6 h-0.5 bg-black"></div>
                  <div className="w-6 h-0.5 bg-black"></div>
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-red-600 p-0">
              <nav className="flex flex-col gap-2 p-4">
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-4 text-white hover:bg-red-700"
                  onClick={() => {
                    setIsOpen(false)
                    goToViolation("Hero")
                  }}
                >
                  <Home className="w-5 h-5" />
                  <span className="text-lg">Hero Section</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-4 text-white hover:bg-red-700"
                  onClick={() => {
                    setIsOpen(false)
                    goToViolation('WhatToKnow')
                  }}
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-lg">What to Know</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-4 text-white hover:bg-red-700"
                  onClick={() => {
                    setIsOpen(false)
                    goToViolation("HowItWork")
                  }}
                >
                  <LineChart className="w-5 h-5" />
                  <span className="text-lg">How It Works</span>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center">
            
      <div className="relative z-20 flex items-center text-white/90" onClick={() => { navigate('/about-us')}}>
        <img width={60}  src={logo} alt="logo" />
        <span className="text-2xl font-bold">
          {['B', 'L', 'O', 'O', 'D'].map(data => 
            <span className="transition-all duration-300 ease-in-out hover:text-red-600 hover:scale-105">{data}</span>)}
        </span>
        <span className="ml-2 text-sm font-bold">
        {[ 'L', 'i', 'n', 'k'].map(data => 
            <span className="transition-all duration-300 ease-in-out hover:text-red-600 hover:scale-105">{data}</span>)}
        </span>
      </div>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/about-us")}
          className="text-xl font-semibold text-red-600 hover:bg-transparent"
        >
          ABOUT
        </Button>
      </header>
      <div className="pt-20">
        <Outlet />
      </div>
    </main>
  )
}
