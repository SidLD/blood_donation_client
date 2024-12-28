'use client'

import  { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Droplet, ArrowLeft } from 'lucide-react'
import { format, addMonths, subMonths, parseISO, setHours, setMinutes } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Skeleton } from '@/components/ui/skeleton'
import { getHospitalCalendar } from '@/lib/api'

// Types
interface Appointment {
  id: string;
  time: string;
  patientName: string;
  screeningType: string;
  bloodUnits: number;
}

interface DayData {
  date: number;
  bloodUnits: number;
  appointments: Appointment[];
}

interface CalendarData {
  [date: string]: DayData;
}

interface Transaction {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  datetime: string;
  status: string;
  hospital: string;
  remarks: string;
}


export default function HospitalCalendar(): JSX.Element {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [calendarData, setCalendarData] = useState<CalendarData>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handlePrevMonth = (): void => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = (): void => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const fetchHospitalCalendar = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
      const year = currentDate.getFullYear().toString()
      const { data } = await getHospitalCalendar(month, year) as unknown as any
      
      if(data.length) {
         const formattedData: CalendarData = data.reduce((acc: CalendarData, transaction: Transaction) => {
        const dateStr = format(new Date(transaction.datetime), 'yyyy-MM-dd')
        if (!acc[dateStr]) {
          acc[dateStr] = {
            date: new Date(transaction.datetime).getDate(),
            bloodUnits: 0,
            appointments: []
          }
        }
        acc[dateStr].bloodUnits += 1
        acc[dateStr].appointments.push({
          id: transaction._id,
          time: format(new Date(transaction.datetime), 'HH:mm'),
          patientName: transaction.user.username,
          screeningType: 'Blood Donation',
          bloodUnits: 1
        })
        return acc
      }, {})

      setCalendarData(formattedData)
      }
    } catch (error) {
      console.error('Error fetching hospital calendar:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHospitalCalendar()
  }, [currentDate])

  const handleDateClick = (dateStr: string): void => {
    setSelectedDate(dateStr)
  }

  const weekDays: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const daysInMonth: number = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()
  const firstDayOfMonth: number = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay()

  const renderCalendarView = (): JSX.Element => (
    <div className="p-6 w-full h-full bg-[#F8EFEF] rounded-lg relative">
      <div className="flex items-center justify-between mb-8">
        <div className="text-6xl font-bold text-[#4A1515]">
          {format(currentDate, 'dd')}
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold text-[#4A1515] mb-4">
            HOSPITAL CALENDAR
          </h1>
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl font-bold text-[#4A1515]">
              {format(currentDate, 'MMMM')}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        <div className="text-4xl font-bold text-red-600">
          {format(currentDate, 'yyyy')}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`text-center font-bold ${
              index === 0 || index === 6 ? 'text-red-600' : 'text-[#4A1515]'
            }`}
          >
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const dateStr = format(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
            'yyyy-MM-dd'
          )
          const dayData = calendarData[dateStr]

          return (
            <button
              key={day}
              onClick={() => handleDateClick(dateStr)}
              className="relative p-2 text-center transition-colors rounded-lg hover:bg-gray-100"
            >
              <span
                className={`text-xl ${
                  (firstDayOfMonth + index) % 7 === 0 ||
                  (firstDayOfMonth + index) % 7 === 6
                    ? 'text-red-600'
                    : 'text-[#4A1515]'
                }`}
              >
                {day}
              </span>
              {dayData?.bloodUnits > 0 && (
                <div className="absolute top-0 right-0 flex items-center">
                  <Droplet className="w-3 h-3 text-red-600" />
                  <span className="text-xs text-red-600">
                    {dayData.bloodUnits}
                  </span>
                </div>
              )}
              {dayData?.appointments.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 text-xs text-gray-600">
                  {dayData.appointments[0].time}
                </div>
              )}
            </button>
          )
        })}
      </div>
      <div className="absolute top-5 left-4">
        <a href="/admin" className="flex items-center text-[#4A1515] hover:text-red-600">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Admin
        </a>
      </div>
    </div>
  )

  const renderDayView = (): JSX.Element | null => {
    if (!selectedDate) return null

    const dayData = calendarData[selectedDate]
    const date = parseISO(selectedDate)

    const timeSlots: string[] = Array.from({ length: 24 }, (_, i) => 
      `${i.toString().padStart(2, '0')}:00`
    )

    return (
      <div className="p-6 bg-[#F8EFEF] rounded-lg h-full flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setSelectedDate(null)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#4A1515] text-white flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">
                {format(date, 'd')}
              </span>
              <span className="text-sm">{format(date, 'EEE')}</span>
            </div>
            <h2 className="text-2xl font-bold text-[#4A1515]">
              SCHEDULED SCREENINGS
            </h2>
          </div>
        </div>

        <div className="relative flex-grow overflow-y-auto">
          <div className="absolute left-0 text-sm text-gray-500">Manila Time</div>
          <div className="mt-8 space-y-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full h-12 bg-gray-200"
                />
              ))
            ) : (
              timeSlots.map((time) => {
                const [hours, minutes] = time.split(':').map(Number)
                const slotDate = toZonedTime(setMinutes(setHours(date, hours), minutes), 'Asia/Manila')
                const formattedTime = format(slotDate, 'h:mm a')
                const appointment = dayData?.appointments.find(
                  (a) => a.time === time
                )

                return (
                  <div key={time} className="relative">
                    <div className="absolute w-24 text-right text-gray-600 -left-24">
                      {formattedTime}
                    </div>
                    <div
                      className={`h-12 border-t-2 ${
                        appointment ? 'border-red-600' : 'border-gray-300'
                      }`}
                    >
                      {appointment && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-semibold">{formattedTime}</span> - {appointment.patientName} - {appointment.screeningType}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#3D0000] flex flex-col w-full h-full">
      {selectedDate ? renderDayView() : renderCalendarView()}
    </div>
  )
}

