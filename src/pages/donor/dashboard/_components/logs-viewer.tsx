'use client'

import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { TransactionModal } from './transaction-modal'
import { Badge } from '@/components/ui/badge'
import { getDonorApplications, updateTransaction } from '@/lib/api'
import { TransactionForm } from '@/types/transaction'

export interface Log {
  _id: string
  user: string
  datetime: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  hospital: {
    _id: string
    username: string
    address: string
  }
  createdAt: string
  updatedAt: string
  __v: number
}

async function deleteTransaction(id: string): Promise<void> {
  const response = await fetch(`/api/transactions/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete transaction')
  }
}

export default function LogsViewer() {
  const [logs, setLogs] = useState<Log[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Log | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const { data } = await getDonorApplications() as unknown as any
      if (data.length > 0) {
        setLogs(data)
      } else {
        setLogs([])
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch donation logs. Please try again.',
        variant: 'destructive'
      })
      setLogs([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTransaction = async (id: string, newDateTime: Date) => {
    try {
      await updateTransaction(id, { ...selectedTransaction, datetime: newDateTime } as unknown as TransactionForm) as unknown as any
      await fetchLogs();
      toast({
        title: 'Transaction Updated',
        description: 'The transaction date and time have been updated successfully.',
      })
    } catch (error) {
      console.error('Error updating transaction:', error)
      toast({
        title: 'Error',
        description: 'Failed to update transaction. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id)
      setLogs(prevLogs => prevLogs.filter(log => log._id !== id))
      toast({
        title: 'Transaction Deleted',
        description: 'The transaction has been deleted successfully.',
      })
    } catch (error) {
      console.error('Error deleting transaction:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete transaction. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const openTransactionModal = (transaction: Log) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return <div className="text-white">Loading logs...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Donation Logs</h2>
      <div className="border border-gray-700 rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Hospital</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell className="font-medium text-white">
                  {format(parseISO(log.datetime), 'MMM d, yyyy hh:mm a')}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={log.status === 'PENDING' ? "outline" : log.status === 'APPROVED' ? "default" : "destructive"}
                  >
                    {log.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-white">{log.hospital.username}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => openTransactionModal(log)}
                    variant="outline"
                    size="sm"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedTransaction && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transaction={selectedTransaction}
          onUpdate={handleUpdateTransaction}
          onDelete={handleDeleteTransaction}
        />
      )}
    </div>
  )
}

