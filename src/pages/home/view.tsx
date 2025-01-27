import type React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import background from "../../assets/full-background.png"

const HomeView: React.FC = () => {
  const navigate = useNavigate()

  return (
    <main className="relative min-h-screen mt-10 bg-gradient-to-br from-red-600 to-red-50">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div
          className="absolute inset-0 max-w-6xl mx-auto my-20 overflow-hidden rounded-3xl"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 75% 100%, 0 100%)",
          }}
        >
          <div className="absolute bottom-[-5%] right-[5%] z-50 flex flex-col items-end space-y-[-2rem]">
            <Button
              onClick={() => navigate("/login")}
              className="w-64 h-20 px-12 text-xl font-semibold text-red-600 transition transform rounded-full shadow-lg bg-white/90 hover:bg-white hover:scale-105"
            >
              LOG IN
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="h-20 px-12 text-xl font-semibold text-red-600 transition transform rounded-full shadow-lg w-80 bg-red-50/90 hover:bg-red-50 hover:scale-105"
            >
              REGISTER NOW
            </Button>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white max-w-2xl absolute top-[20%] left-[5%]">
            Heroes don't always wear capes—
            <br />
            Sometimes they donate.
          </h1>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="min-h-screen p-8 pt-24">
        <h2 className="mb-8 text-4xl font-bold">HOW IT WORKS</h2>
        <div className="space-y-6">
          <div className="p-6 text-white bg-red-600/90 rounded-xl">
            <p className="text-xl">For admins (medical technologists), please register with your license ID.</p>
          </div>
          <div className="p-6 text-white bg-red-600/90 rounded-xl">
            <p className="text-xl">
              For donors, click register to schedule an appointment to avail Donor ID (which allows you to have an
              account).
            </p>
          </div>
          <div className="p-6 text-white bg-red-600/90 rounded-xl">
            <p className="text-xl">Fill in all the necessary information.</p>
          </div>
          <div className="p-6 text-white bg-red-600/90 rounded-xl">
            <p className="text-xl">You can now access the dashboard.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomeView

