
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Droplet } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"

import background from '@/assets/back2.png'

const slides = [
  {
    title: "WHO CAN DONATE?",
    items: [
      "Individuals aged 18-65",
      "Minimum Weight of 50 kg/110 lbs",
      "Those who are healthy, feel well and be free of any cold, flu, or fever on the day of donation.",
      "Women on their menstruation period that are feeling well.",
      "Those who are not pregnant",
      "Free of any disqualifying medical conditions (refer to the permanent disqualification criteria next to this to identify)",
      "Those who are NOT anemic",
      "Normal hemoglobin levels: for males is 14 to 18 g/dl; that for females is 12 to 16 g/dl",
    ],
  },
  {
    title: "PERMANENT DISQUALIFICATIONS",
    items: [
      "Those who have chronic illnesses",
      "Those who have tested positive for HIV/AIDS, hepatitis B or C infection, ebola virus, active or treated cancers, undergoing dialysis, severe heart conditions, and with unexplained health issues",
      "Have acute infections.",
      "You must not donate blood If you do not meet the minimum haemoglobin level for blood donation (12.0 g/dl for females and not less than 13.0 g/dl for males)",
      "Those who have ever injected recreational drugs.",
      "Those who have been disclosed of any blood disease.",
      "Those who have/had certain forms of cancer.",
    ],
  },
  {
    title: "TEMPORARY DISQUALIFICATIONS",
    items: [
      "Those who undergone piercings/tattoo procedures in a licensed facility must wait 6-12 months",
      "Postpartum and breastfeeding women are not advisable to donate blood",
      "Persons who underwent surgery or medical procedures (dental, oral, etc.) must wait 6-12 months",
      "Those who travelled recently to high-risk areas with malaria, dengue, zika virus, or other infectious disease may be deferral from 3-12 months.",
      "Those who have tested positive for HIV/AIDS, hepatitis B or C infection, active or treated cancers, undergoing dialysis, severe heart conditions, and with unexplained health issues",
      'If one has engaged in "at risk" sexual activity in the past 12 months',
    ],
  },
  {
    title: "TEMPORARY DISQUALIFICATIONS",
    items: [
      "Persons with heart conditions may need to consult a doctor for eligibility",
      "Have bleeding conditions",
      "Are taking certain drugs for medications (should consult an expert first)",
      "Those who just got vaccinated (wait periods may vary)",
      "Individuals with heavy alcohol use prior to donation (wait at least 24 hours after drinking).",
    ],
    footer:
      "If you have any hesitation, is experiencing some of the disqualifications, have undiagnosed conditions and certain medical concerns, it is always best consult a health professional before considering to donate.",
  },
]

export function WhatToKnow() {
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setSelectedIndex(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi])

  return (
    <section id="WhatToKnow" className="min-h-screen px-2 py-16 lg:px-24 " 
    style={{
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
    >
      <h2 className="mb-8 font-bold text-red-600 lg:text-5xl">WHAT TO KNOW</h2>
      <div className="relative w-full lg:max-w-[90%] mx-auto">
        <Carousel ref={emblaRef} className="w-full">
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <Card className="bg-gray-100 shadow-lg rounded-3xl">
                  <CardHeader>
                    <CardTitle className="font-bold text-center text-red-600 lg:text-3xl">{slide.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-10 space-y-4 lg:px-20">
                    {slide.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-red-600">
                        <Droplet className="flex-shrink-0 w-6 h-6 mt-1" fill="currentColor" />
                        <p className="lg:text-lg">{item}</p>
                      </div>
                    ))}
                    {slide.footer && <p className="mt-6 text-lg italic text-center text-red-600">{slide.footer}</p>}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute w-8 h-8 text-white -translate-y-1/2 bg-red-600 left-4 top-1/2 hover:bg-red-700" />
          <CarouselNext className="absolute w-8 h-8 text-white -translate-y-1/2 bg-red-600 right-4 top-1/2 hover:bg-red-700" />
        </Carousel>
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === selectedIndex ? "bg-red-600" : "bg-red-200"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

