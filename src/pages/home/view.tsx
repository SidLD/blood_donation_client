import type React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import background from "../../assets/home_landing_logo1.png"
import logo from "../../assets/logo.png"
import { WhatToKnow } from "./_components/whatToKnow";
import { HowItWorks } from "./_components/howItWorks";
import { Textarea } from "@/components/ui/textarea";
import { CircleAlert, Mail, Megaphone } from "lucide-react";

const HomeView: React.FC = () => {
  const navigate = useNavigate()

  return (
    <main className="relative min-h-screen ">
      <section id="Hero" className="relative h-screen lg:w-full ">
        <div
          className="absolute inset-0 mx-auto my-20 overflow-hidden border-2 border-white max-w-[95%] max-h-[75%] rounded-3xl"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            clipPath: "polygon(0 0, 100% 0, 100% 75%, 70% 100%, 0 100%)",
          }}
        >

          <h1 className="text-5xl md:text-7xl font-bold text-white max-w-2xl absolute top-[20%] left-[5%]">
            Heroes don't always wear capes—
            <br />
            Sometimes they donate.
          </h1>
        </div>
           
        <div className="absolute bottom-24 right-[5%] z-20 flex flex-col items-end space-y-[-2rem]">
            <Button
              onClick={() => navigate("/login")}
              className="w-[80%] h-28  text-[2.2rem] font-semibold text-red-600 transition transform bg-white rounded-full shadow-lg md:w-[130%] hover:bg-white hover:scale-105"
            >
              LOG IN
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="w-[100%] h-28 px-12 text-[2.2rem] text-red-600 transition transform rounded-full shadow-lg md:w-[150%] bg-red-50 hover:bg-red-50 hover:scale-105"
            >
              REGISTER NOW
            </Button>
        </div>
        <div className="absolute bottom-2 right-[5%] sm:left-[30%] lg:left-[50%] flex gap-16">
            <button
              className="lg:text-[2rem] lg:h-24 bg-none border-none text-red-600 flex gap-2 justify-center items-center"
              onClick={() => navigate("/events")}
            >
              <Megaphone className="rotate-180 lg:w-16 lg:h-16"/>
               Events
            </button>
            <button
              className="lg:text-[2rem] lg:h-24 bg-none text-red-600 flex gap-2 justify-center items-center"
              onClick={() => navigate("/#WhatToKnow")}
            >
              <CircleAlert className="rotate-180 lg:w-16 lg:h-16"/>
              What To Know
            </button>
        </div>
        
      </section>
      <WhatToKnow />
      <HowItWorks />
      <footer className="bg-[#d80404] text-white py-12">
        <div className="container grid grid-cols-1 gap-8 px-4 mx-auto md:grid-cols-3">
        {/* Logo and Contact */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="BloodLink Logo" className="h-32" />
            <span className="text-2xl font-bold">
              BLOOD<span className="text-white">Link</span>
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Contact Us</h3>
            <a href="mailto:bloodlink.saveslives@gmail.com" className="flex items-center gap-2 hover:text-red-200">
              <span><Mail /></span>
              bloodlink.saveslives@gmail.com
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Information</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about-us" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="/#Hero" className="hover:underline">
                  Hero Section
                </a>
              </li>
              <li>
                <a href="/#WhatToKnow" className="hover:underline">
                  What to Know
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-semibold">Helpful Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="*" className="hover:underline">
                  Terms & Condition
                </a>
              </li>
              <li>
                <a href="*" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Feedback Form */}
        <div>
          <h3 className="mb-4 text-xl font-semibold">Send a feedback:</h3>
          <form className="space-y-4">
            <Textarea
              className="min-h-[120px] bg-red-50 border-none text-gray-800 rounded-xl"
              placeholder="Write your feedback here..."
            />
            <Button
              type="submit"
              className="float-right px-8 font-semibold text-red-600 rounded-full bg-red-50 hover:bg-red-100"
            >
              Submit
            </Button>
          </form>
        </div>
        </div>
      </footer>
    </main>
  )
}

export default HomeView

