import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextReveal } from '@/components/ui/typography'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import logo from '../..//assets/logo.png'
import background from '../../assets/full-background.png'
import { getEvents } from '@/lib/api'
import Autoplay from "embla-carousel-autoplay"

interface IEvent {
  _id: string;
  title: string;
  description: string;
  location: string;
  imgUrl: string;
  startDate: string;
  endDate: string;
  user: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

const HomeView: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data } = await getEvents() as { data: IEvent[] };
      if(data.length > 0){
        setEvents(data);
      }else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Error fetching events:', err)
    }
  }

  const categorizeEvents = () => {
    const now = new Date()
    const pastEvents = events.filter(event => new Date(event.endDate) < now)
    const currentEvents = events.filter(event => new Date(event.startDate) <= now && new Date(event.endDate) >= now)
    const upcomingEvents = events.filter(event => new Date(event.startDate) > now)

    return { pastEvents, currentEvents, upcomingEvents }
  }

  const { pastEvents, currentEvents, upcomingEvents } = categorizeEvents()

  return (
    <main className="min-h-screen bg-gradient-to-t from-black to-transparent bg-[#4b0c0c] relative overflow-y-auto snap-y snap-mandatory pt-20">
      <img 
        src={background} 
        alt="background"
        className="fixed inset-0 z-0 object-cover w-full h-full"
      />
      <div className="fixed inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />

      <div className="fixed top-0 left-0 right-0 z-30 flex items-center p-6 text-white/90" onClick={() => { navigate('/about-us')}}>
        <img width={60} src={logo} alt="logo" />
        <span className="text-2xl font-bold">
          {['B', 'L', 'O', 'O', 'D'].map((data, index) => 
            <span key={index} className="transition-all duration-300 ease-in-out hover:text-red-600 hover:scale-105">{data}</span>)}
        </span>
        <span className="ml-2 text-sm font-bold">
        {['L', 'i', 'n', 'k'].map((data, index) => 
            <span key={index} className="transition-all duration-300 ease-in-out hover:text-red-600 hover:scale-105">{data}</span>)}
        </span>
      </div>

      <div className="z-20 flex flex-col">
        <section className="flex flex-col items-center justify-center h-screen text-center text-white snap-start">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            <TextReveal>Be the Link, Be the Lifesaver.</TextReveal>
          </h1>
          <div className="z-30 flex flex-col justify-center gap-4 mt-8 md:flex-row">
            <Button onClick={() => { navigate('/login')}}
              className="w-60 h-12 text-lg font-medium bg-[#8d2727] hover:bg-[#2D0000] text-white border border-[#500000] rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              LOG IN
            </Button>
            <Button onClick={() => { navigate('/register')}}
              className="w-60 h-12 text-lg font-medium bg-[#8d2727] hover:bg-[#2D0000] text-white border border-[#500000] rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              CREATE ACCOUNT
            </Button>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center w-full h-screen max-w-4xl mx-auto text-white snap-start">
          <h2 className="mb-8 text-3xl font-bold text-center">Events</h2>
          <Carousel className="w-full" 
           plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}>
            <CarouselContent>
              <CarouselItem>
                <EventCategory title="Past Events" events={pastEvents} />
              </CarouselItem>
              <CarouselItem>
                <EventCategory title="Current Events" events={currentEvents} />
              </CarouselItem>
              <CarouselItem>
                <EventCategory title="Upcoming Events" events={upcomingEvents} />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="mt-8 text-center">
            <Button 
              onClick={() => navigate('/about-us')}
              className="bg-[#8d2727] hover:bg-[#2D0000] text-white border border-[#500000] rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              View More
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}

const EventCategory: React.FC<{ title: string; events: IEvent[] }> = ({ title, events }) => (
  <div>
    <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
    <div className="space-y-4">
      {events.map(event => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  </div>
)

const EventCard: React.FC<{ event: IEvent }> = ({ event }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="text-white bg-white/10">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-48 mb-4">
          <img
            src={event.imgUrl}
            alt={event.title}
            className="object-cover w-full h-full rounded-md"
          />
        </div>
        <p className="mb-2 text-sm">{event.description}</p>
        <p className="text-sm"><strong>Location:</strong> {event.location}</p>
        <p className="text-sm"><strong>Start:</strong> {formatDate(event.startDate)}</p>
        <p className="text-sm"><strong>End:</strong> {formatDate(event.endDate)}</p>
        <p className="text-sm"><strong>Organizer:</strong> {event.user.username}</p>
      </CardContent>
    </Card>
  )
}

export default HomeView

