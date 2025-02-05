
import credited from "../../assets/credited.png"
export default function AboutUs() {
    return (
      <div className="flex flex-col items-center w-full">
        <section className="w-full min-h-screen px-4 py-16 pt-24 text-center bg-[#4A0E0E]">
          <h2 className="mb-6 text-5xl font-bold text-white">What is BloodLink?</h2>
          <p className="max-w-4xl mx-auto text-xl leading-relaxed text-white">
            The website is created for accessible, convenient, and easy transactions for blood donations. It is designed
            to meet the healthcare needs of the locality through a database. We collaborate with medical technologists
            within hospitals where through registration are able to navigate the website such as the list of certified
            donors, blood supply levels, and blood screening schedules.
          </p>
        </section>
  
        <section className="w-full py-16 bg-[#3D0A0A]">
          <div className="max-w-6xl px-4 mx-auto text-center">
            <h2 className="mb-12 text-5xl font-bold text-white">CREDITED HOSPITALS</h2>
            <div className="flex justify-center">
              <div className="p-8 rounded-lg bg-[#5C1414] max-w-md">
                <img
                  src={credited}
                  alt="Credited Hospital Logo"
                  width={200}
                  height={200}
                  className="mx-auto mb-4"
                />
                <p className="text-lg text-white">
                  We are a public institution providing medical services, emergency care, surgeries, and other healthcare.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
  