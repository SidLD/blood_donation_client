import React, { useState, useEffect } from 'react'
import { getDownloadURL, ref } from 'firebase/storage'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Storage } from '@/lib/firebase'
import { useNavigate } from 'react-router-dom'
import { EventType } from '@/types/interface'
import { getEvents } from '@/lib/api'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const ITEMS_PER_PAGE = 6;

const EventsViewPage: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([])
  const [_isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("upcoming")
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const { data } = await getEvents() as unknown as any;
      if (data.length > 0) {
        const updatedEvents = await Promise.all(data.map(async (temp: EventType) => {
          let tempImg = null;
          try {
             tempImg = await getDownloadURL(ref(Storage, temp.imgUrl));
          } catch (error) {
            tempImg = null
          }
          return {
            ...temp,
            imgUrl: tempImg
          };
        }));
        setEvents(updatedEvents);
      } else {
        setEvents([])
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      toast({
        title: "Error",
        description: "Failed to fetch events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  };

  const handleViewEvent = (event: EventType) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  const filterEvents = (status: string) => {
    const now = new Date()
    return events.filter(event => {
      const eventDate = new Date(event.date)
      switch(status) {
        case 'upcoming':
          return eventDate > now
        case 'current':
          return eventDate.toDateString() === now.toDateString()
        case 'done':
          return eventDate < now
        default:
          return true
      }
    })
  }

  const paginateEvents = (filteredEvents: EventType[]) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }

  const filteredEvents = filterEvents(activeTab)
  const paginatedEvents = paginateEvents(filteredEvents)
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE)

  return (
    <div className="relative min-h-screen bg-[#4A1515]">
      <div className="absolute mt-8 left-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-white hover:opacity-80"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="p-8 mx-auto max-w-7xl">
        <h1 className="mt-16 mb-8 text-4xl font-bold text-center text-white">Events</h1>

        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <EventGrid events={paginatedEvents} onViewEvent={handleViewEvent} />
          </TabsContent>
          <TabsContent value="current">
            <EventGrid events={paginatedEvents} onViewEvent={handleViewEvent} />
          </TabsContent>
          <TabsContent value="done">
            <EventGrid events={paginatedEvents} onViewEvent={handleViewEvent} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-8 space-x-4">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
              <DialogDescription>
                View the details of the selected event.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="mt-8 max-h-[60vh] pr-6">
              {selectedEvent && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                  <p>{selectedEvent.description}</p>
                  <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
                  <p><strong>Location:</strong> {selectedEvent.location}</p>
                  {selectedEvent.imgUrl && (
                    <img
                      src={selectedEvent.imgUrl}
                      alt={selectedEvent.title}
                      className="object-cover w-full h-48 rounded-md"
                    />
                  )}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </div>
  )
}

interface EventGridProps {
  events: EventType[]
  onViewEvent: (event: EventType) => void
}

const EventGrid: React.FC<EventGridProps> = ({ events, onViewEvent }) => {
  return (
    <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <div
          key={event._id}
          className="bg-[#3D0000] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
          onClick={() => onViewEvent(event)}
        >
          <div className="relative h-48">
            <img
              src={event.imgUrl || '/placeholder.svg'}
              alt={event.title}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">
              {event.title}
            </h3>
            <p className="mb-2 text-sm text-white/80">
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-white/80">
              {event.location}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EventsViewPage

