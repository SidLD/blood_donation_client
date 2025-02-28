

import background from '@/assets/back2.png'
export const HowItWorks = () => {
    const steps = [
        {
          number: 1,
          content: [
            "For admins (medical technologists), please register with your License ID.",
            "For donors, click register to schedule an appointment to avail Donor ID (which allows you to have an account).",
          ],
        },
        {
          number: 2,
          content: ["Fill in all the necessary information."],
        },
        {
          number: 3,
          content: ["You can now access the dashboard."],
        },
      ]
  return (
  <section id="HowItWork" className="min-h-screen py-16 md:px-24" 
    style={{
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
    >
     <h2 className="mb-8 text-5xl font-bold text-red-600 ">HOW IT WORKS</h2>
      <div className="max-w-[90%] mx-auto space-y-6">
        {steps.map((step) => (
          <div key={step.number} className="relative flex items-start gap-6 p-6 bg-[#8d2727] rounded-3xl shadow-lg">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-2xl font-bold text-white bg-red-400 rounded-full">
              {step.number}
            </div>
            <div className="space-y-2">
              {step.content.map((text, index) => (
                <p key={index} className="text-xl text-white">
                  {text}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
  </section>
  )
}
