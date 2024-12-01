import React, { useState, useEffect } from 'react'
import { ref, deleteObject, getDownloadURL } from 'firebase/storage'
import { ArrowLeft, Eye, Pencil, Trash } from 'lucide-react'
import { Storage } from '@/lib/firebase'
import { uploadImage } from '@/lib/upload'
import { useNavigate } from 'react-router-dom'
import { EventType } from '@/types/interface'
import { createEvent, getEvents, updateEvent, deleteEvent } from '@/lib/api'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const EventsPage: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [events, setEvents] = useState<EventType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
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
      }else{
        setEvents([])
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      toast({
        title: "Error",
        description: "Failed to fetch events. Please try again.",
        variant: "destructive",
      })
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let imageUrl = null

    if (!image && !isUpdating) {
      toast({
        title: "Error",
        description: "Please select an image to upload.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (image) {
        const uploadedImageRef = await uploadImage(image, `${title}-${new Date()}`) as string;
        imageUrl = await getDownloadURL(ref(Storage, uploadedImageRef));
      }

      const eventData: EventType = {
        title,
        description,
        imgUrl: imageUrl || (selectedEvent?.imgUrl || ''),
        date: date || new Date().toISOString(),
        location,
      };

      if (isUpdating && selectedEvent) {
        await updateEvent(selectedEvent._id!, eventData)
      } else {
        await createEvent(eventData as EventType)
      }

      resetForm()
      await fetchEvents()

      toast({
        title: "Success",
        description: `Event ${isUpdating ? 'updated' : 'created'} successfully!`,
      })
      setShowModal(false)
    } catch (err) {
      console.error(`Error ${isUpdating ? 'updating' : 'creating'} event:`, err)
      toast({
        title: "Error",
        description: `An error occurred while ${isUpdating ? 'updating' : 'creating'} the event.`,
        variant: "destructive",
      })

      if (imageUrl) {
        const fileRef = ref(Storage, imageUrl)
        await deleteObject(fileRef)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewEvent = (event: EventType) => {
    setSelectedEvent(event)
    setTitle(event.title)
    setDescription(event.description)
    setDate(new Date(event.date).toISOString().split('T')[0])
    setLocation(event.location)
    setShowModal(true)
    setIsUpdating(false)
  }

  const handleUpdateEvent = (event: EventType) => {
    setTitle(event.title)
    setDescription(event.description)
    setDate(new Date(event.date).toISOString().split('T')[0])
    setLocation(event.location)
    setSelectedEvent(event)
    setIsUpdating(true)
    setShowModal(true)
  }

  const handleDeleteEvent = async (event: EventType) => {
    try {
      await deleteEvent(event._id!)
      toast({
        title: "Success",
        description: "Event deleted successfully!",
      })
      await deleteObject(ref(Storage, event.imgUrl))
      await fetchEvents()
    } catch (err) {
      console.error('Error deleting event:', err)
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setShowDeleteConfirm(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setDate('')
    setLocation('')
    setImage(null)
    setIsUpdating(false)
    setSelectedEvent(null)
  }

  return (
    <div className="relative min-h-full min-w-full bg-[#4A1515]">
      <div className="absolute mt-8 left-8">
        <button
          onClick={() => {
            navigate('/admin')
          }}
          className="flex items-center text-white hover:opacity-80"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Admin</span>
        </button>
      </div>

      <div className="p-8 mx-auto max-w-7xl">
        <div className="float-right text-center">
          <Button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="bg-red-600 hover:bg-red-500"
          >
            Create New Event
          </Button>
        </div>

        <h2 className="mt-16 text-2xl font-bold text-white">All Events</h2>
        <div className="overflow-x-auto mt-4 bg-[#3D0000] p-4 rounded-lg">
          <table className="min-w-full text-white">
            <thead>
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-700">
                  <td className="p-3">{event.title}</td>
                  <td className="p-3">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="p-3">{event.location}</td>
                  <td className="p-3">
                    <Button variant="ghost" size="icon" onClick={() => handleViewEvent(event)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleUpdateEvent(event)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => {
                      setSelectedEvent(event)
                      setShowDeleteConfirm(true)
                    }}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{isUpdating ? 'Update Event' : (selectedEvent && !isUpdating ? 'View Event' : 'Create New Event')}</DialogTitle>
              <DialogDescription>
                {isUpdating ? `Make changes to your event here. Click save when you're done.` : (selectedEvent && !isUpdating ? 'Event details' : 'Add a new event to your calendar.')}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="mt-8 max-h-[60vh] pr-6">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                    required
                    disabled={!!(selectedEvent && !isUpdating)}
                  />
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter event description"
                    rows={4}
                    required
                    disabled={!!(selectedEvent && !isUpdating)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={!!(selectedEvent && !isUpdating)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter event location"
                    required
                    disabled={!!(selectedEvent && !isUpdating)}
                  />
                </div>
              
                {(isUpdating || !selectedEvent) && (
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="image">Event Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                )}

                {selectedEvent && selectedEvent.imgUrl && (
                  <div className="mt-4">
                    <img
                      src={selectedEvent.imgUrl}
                      alt={selectedEvent.title}
                      className="object-cover w-full h-48 rounded-md"
                    />
                  </div>
                )}

                {error && <div className="text-red-500">{error}</div>}
              </form>
            </ScrollArea>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => {
                resetForm()
                setShowModal(false)
              }}>
                Cancel
              </Button>

              {(isUpdating || !selectedEvent) && (
                <Button type="submit" disabled={isLoading} onClick={handleFormSubmit}>
                  {isLoading ? 'Uploading...' : (isUpdating ? 'Update' : 'Create') + ' Event'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this event? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => selectedEvent && handleDeleteEvent(selectedEvent)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </div>
  )
}

export default EventsPage

