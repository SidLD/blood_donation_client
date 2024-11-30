import React, { useState, useEffect } from 'react'
import { ref, deleteObject } from 'firebase/storage'
import { ArrowLeft } from 'lucide-react'
import { Storage } from '@/lib/firebase'
import axios from 'axios'
import { uploadImage } from '@/lib/upload'
import { useNavigate } from 'react-router-dom'

export interface Event {
  id: string
  title: string
  description: string
  date: string
  imageUrl: string
  location: string
}

const EventsPage: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEvents([])
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load events.')
      }
    }

    fetchEvents()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let imageUrl = null

    if (!image) {
      setError('Please select an image to upload.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Upload Image to Firebase Storage
      imageUrl = await uploadImage(image, `${title}-${new Date()}`)

      // Step 2: Send Event Data to Backend
      const eventData = {
        title,
        description,
        date,
        imageUrl, // Image URL from Firebase Storage
      }

      await axios.post('/api/events', eventData)

      // Reset form
      setTitle('')
      setDescription('')
      setDate('')
      setImage(null)

      // Refresh the events list
      const response = await axios.get('/api/events')
      setEvents(response.data)

      alert('Event created successfully!')
      setShowModal(false) // Close the modal
    } catch (err) {
      console.error('Error creating event:', err)
      setError('An error occurred while creating the event.')

      // If error occurs, delete the image from Firebase
      if (imageUrl) {
        const fileRef = ref(Storage, imageUrl)
        await deleteObject(fileRef)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEventClick = async (eventId: string) => {
    try {
      const response = await axios.get(`/api/events/${eventId}`)
      setSelectedEvent(response.data)
    } catch (err) {
      console.error('Error fetching event details:', err)
      setError('Failed to fetch event details.')
    }
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
        {/* Create New Event Button */}
        <div className="float-right text-center">
          <button
            onClick={() => setShowModal(true)}
            className="p-3 text-white bg-red-600 rounded-lg hover:bg-red-500"
          >
            Create New Event
          </button>
        </div>

        {/* Events Table */}
        <h2 className="mt-16 text-2xl font-bold text-white">All Events</h2>
        <div className="overflow-x-auto mt-4 bg-[#3D0000] p-4 rounded-lg">
          <table className="min-w-full text-white">
            <thead>
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="cursor-pointer hover:bg-gray-700"
                  onClick={() => handleEventClick(event.id)}
                >
                  <td className="p-3">{event.title}</td>
                  <td className="p-3">{event.date}</td>
                  <td className="p-3">{event.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-white rounded-lg w-[50%]">
              <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
              <p className="mt-2">{selectedEvent.description}</p>
              <p className="mt-2 text-sm">Date: {selectedEvent.date}</p>
              <img
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
                className="object-cover w-full h-64 mt-4 rounded-lg"
              />
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 mt-4 text-white bg-red-600 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Event Creation Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center w-full bg-black bg-opacity-50">
            <div className="p-6 w-[50%] bg-[#3D0000] text-white rounded-lg">
              <h2 className="mb-4 text-xl font-bold">Create New Event</h2>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="flex flex-col">
                  <label htmlFor="title" className="mb-2">Title</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-3 text-black rounded-lg"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="description" className="mb-2">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-3 text-black rounded-lg"
                    placeholder="Enter event description"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="date" className="mb-2">Date</label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-3 text-black rounded-lg"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="image" className="mb-2">Event Image</label>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="p-3 text-black rounded-lg"
                    required
                  />
                </div>

                {error && <div className="text-red-500">{error}</div>}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="p-3 text-black bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="p-3 text-white bg-red-600 rounded-lg"
                  >
                    {isLoading ? 'Uploading...' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsPage
