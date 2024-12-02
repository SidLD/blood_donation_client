'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
// import { getTransactions, generateDonorIds, updateTransaction, deleteTransaction } from '@/lib/api'

interface Transaction {
  id: string
  user: string
  admin: string
  date: string
  status: 'pending' | 'success' | 'reject'
  remarks: string
}

const BloodSupplyPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [donorIds, _setDonorIds] = useState<string[]>([])
  const [numDonorIds, setNumDonorIds] = useState(1)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [_deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      // const data = await getTransactions()
      // setTransactions(data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast({
        title: "Error",
        description: "Failed to fetch transactions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateDonorIds = async () => {
    try {
      // const ids = await generateDonorIds(numDonorIds)
      // setDonorIds(ids)
      toast({
        title: "Success",
        description: `Generated ${numDonorIds} donor ID(s).`,
      })
    } catch (error) {
      console.error('Error generating donor IDs:', error)
      toast({
        title: "Error",
        description: "Failed to generate donor IDs. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTransaction = async (_updatedTransaction: Transaction) => {
    try {
      // await updateTransaction(updatedTransaction)
      // setTransactions(transactions.map(t => 
      //   t.id === updatedTransaction.id ? updatedTransaction : t
      // ))
      setEditingTransaction(null)
      toast({
        title: "Success",
        description: "Transaction updated successfully.",
      })
    } catch (error) {
      console.error('Error updating transaction:', error)
      toast({
        title: "Error",
        description: "Failed to update transaction. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      // await deleteTransaction(transactionId)
      setTransactions(transactions.filter(t => t.id !== transactionId))
      setDeletingTransaction(null)
      toast({
        title: "Success",
        description: "Transaction deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting transaction:', error)
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-full min-w-full bg-[#F8EFEF] p-8">
        <div className="text-center text-[#4A1515]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-full min-w-full bg-[#F8EFEF]">
      <div className="relative top-4 left-8">
        <a
          href="/admin"
          className="flex items-center text-[#4A1515] hover:opacity-80"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          <span>Back to Admin</span>
        </a>
      </div>
      <div className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#4A1515]">
            Transactions
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Generate Donor IDs
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Generate Donor IDs</DialogTitle>
                <DialogDescription>
                  Enter the number of donor IDs you want to generate.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="numIds" className="text-right">
                    Number of IDs
                  </Label>
                  <Input
                    id="numIds"
                    type="number"
                    className="col-span-3"
                    value={numDonorIds}
                    onChange={(e) => setNumDonorIds(parseInt(e.target.value))}
                    min={1}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleGenerateDonorIds}>Generate</Button>
              </DialogFooter>
              {donorIds.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-2 font-semibold">Generated Donor IDs:</h3>
                  <ul className="pl-5 list-disc">
                    {donorIds.map((id) => (
                      <li key={id}>{id}</li>
                    ))}
                  </ul>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Admin/Hospital</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.user}</TableCell>
                <TableCell>{transaction.admin}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    transaction.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                    transaction.status === 'success' ? 'bg-green-200 text-green-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </TableCell>
                <TableCell>{transaction.remarks}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => setEditingTransaction(transaction)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the transaction.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteTransaction(transaction.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
              <DialogDescription>
                Update the status and remarks of this transaction.
              </DialogDescription>
            </DialogHeader>
            {editingTransaction && (
              <form onSubmit={(e) => {
                e.preventDefault()
                if (editingTransaction.remarks) {
                  handleUpdateTransaction(editingTransaction)
                } else {
                  toast({
                    title: "Error",
                    description: "Remarks are required when updating the status.",
                    variant: "destructive",
                  })
                }
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid items-center grid-cols-4 gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={editingTransaction.status}
                      onValueChange={(value: 'pending' | 'success' | 'reject') => 
                        setEditingTransaction({...editingTransaction, status: value})
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="reject">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid items-center grid-cols-4 gap-4">
                    <Label htmlFor="remarks" className="text-right">
                      Remarks
                    </Label>
                    <Textarea
                      id="remarks"
                      value={editingTransaction.remarks}
                      onChange={(e) => setEditingTransaction({...editingTransaction, remarks: e.target.value})}
                      className="col-span-3"
                      placeholder="Enter remarks (required)"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default BloodSupplyPage

