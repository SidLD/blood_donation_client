import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Log {
  id: string
  date: Date
  action: string
  details: string
}

export default function LogsViewer() {
  const [logs, setLogs] = useState<Log[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulating an API call to fetch logs
    const fetchLogs = async () => {
      setIsLoading(true)
      // In a real application, you would fetch this data from your backend
      const dummyLogs: Log[] = [
        { id: '1', date: new Date('2024-01-15'), action: 'Donation', details: 'Successful blood donation at Calbayog District Hospital' },
        { id: '2', date: new Date('2023-12-01'), action: 'Appointment', details: 'Scheduled appointment for blood donation' },
        { id: '3', date: new Date('2023-11-10'), action: 'Test', details: 'Completed blood type test' },
      ]
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      setLogs(dummyLogs)
      setIsLoading(false)
    }

    fetchLogs()
  }, [])

  if (isLoading) {
    return <div className="text-white">Loading logs...</div>
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-white">Donation Logs</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Date</TableHead>
            <TableHead className="text-white">Action</TableHead>
            <TableHead className="text-white">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="text-white">{format(log.date, 'yyyy-MM-dd')}</TableCell>
              <TableCell className="text-white">{log.action}</TableCell>
              <TableCell className="text-white">{log.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

