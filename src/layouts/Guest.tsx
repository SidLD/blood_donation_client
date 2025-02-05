import { Outlet, useLocation, useNavigate } from "react-router-dom"
import logo from '../assets/logo.png'
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, HelpCircle, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GuestLayout() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation();


  useEffect(() => {
    const toVolation = () => {
      try {
        const path = window.location.href.split(window.location.origin)[1]
        console.log(path.substring(2))
        if(path != '/' && path.substring(1, 2) == '#' && (path.substring(2))){
          const element =  document.getElementById(path.substring(2))!
          
          element.scrollIntoView({behavior:'smooth'});
        }
      } catch (error) {
        console.log(error)
      }
    }
    toVolation()
  }, [location])

  return (
    <main className="relative flex flex-col min-h-screen " >

      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between shadow-lg p-7"
      style={{
        background: 'linear-gradient(90deg, rgba(235,235,235,1) 0%, rgba(238,238,238,1) 23%, rgba(238,56,16,1) 50%, rgba(243,167,150,1) 75%, rgba(255,253,253,1) 100%)'
      }}>
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
            <SheetContent side="left" className="w-[500px] bg-[#d80404]/90 p-0">
              <nav className="flex flex-col gap-2 p-4">
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-4 text-white "
                  onClick={() => {
                    setIsOpen(false)
                    navigate("/#Hero")
                  }}
                >
                  <Home className="w-5 h-5" />
                  <span className="text-lg">Hero Section</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-4 text-white hover:bg-[#d80404]/90"
                  onClick={() => {
                    setIsOpen(false)
                    navigate('/#WhatToKnow')
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
                    navigate("/#HowItWork")
                  }}
                >
                  <LineChart className="w-5 h-5" />
                  <span className="text-lg">How It Works</span>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center">
            
      <div className="relative z-20 flex items-center text-red-500/90" onClick={() => { navigate('/about-us')}}>
        <img width={100}  src={logo} alt="logo" className="[filter:brightness(0)_saturate(100%)_invert(15%)_sepia(89%)_saturate(6946%)_hue-rotate(356deg)_brightness(97%)_contrast(113%)]" />
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
