'use client'

import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { getTransactions, updateTransaction, deleteTransaction, getHospitals, getHospitalDonors, createHospitalApplication } from '@/lib/api'
import { Transaction, TransactionForm } from '@/types/transaction'
import { auth } from '@/lib/services'
import { Donor } from '@/types/user'
import { format, parse } from 'date-fns'

const transactionSchema = z.object({
  _id: z.string().optional(),
  hospital: z.string(),
  datetime: z.date(),
  status: z.enum(['PENDING', 'SUCCESS', 'APPROVED', 'REJECT']),
  remarks: z.string(),
  user: z.string(),
});

const BloodSupplyPage: React.FC = () => {
  const [hospitals, setHospitals] = useState<{ _id: string; username: string; address: string }[]>([])
  const [donors, setDonors] = useState<Donor[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [openModal, setOpenModal] = useState<Boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      hospital: '',
      datetime: new Date(),
      status: 'PENDING',
      remarks: '',
      user: '',
    }
  })

  useEffect(() => {
    fetchHospitals()
    fetchHospitalDonors()
    fetchTransactions()
  }, [])

  const fetchHospitals = async () => {
    try {
      const { data } = (await getHospitals()) as unknown as any
      if (data.length > 0) {
        setHospitals(data)
      } else {
        setHospitals([])
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch hospitals. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const fetchHospitalDonors = async () => {
    try {
      const { data } = (await getHospitalDonors()) as unknown as any
      if (data.length > 0) {
        setDonors(data)
      } else {
        setDonors([])
      }
    } catch (error) {
      console.error('Error fetching donors:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch donors. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const { data } = await getTransactions() as unknown as any
      if (data.length > 0) {
        setTransactions(data)
      } else {
        setTransactions([])
      }
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

  const handleCreateTransaction = async (data: z.infer<typeof transactionSchema>) => {
    try {
      console.log(data)
      const payload: TransactionForm = {
        ...data,
        hospital: auth.getUserInfo().id
      }
      if (data._id) {
        await updateTransaction(data._id, payload) as unknown as any
      } else {
        await createHospitalApplication(payload) as unknown as any
      }
      await fetchTransactions()
      setIsCreateDialogOpen(false)
      setOpenModal(false)
      reset()
      toast({
        title: "Success",
        description: data._id ? "Transaction updated successfully." : "Transaction created successfully.",
      })
    } catch (error) {
      console.error('Error creating/updating transaction:', error)
      toast({
        title: "Error",
        description: `Failed to ${data._id ? 'update' : 'create'} transaction. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleUpdateDonor = async (data: Transaction) => {
    let userId = data.type == 'MEMBER-APPOINTMENT' ? 
    data?.user ? data.user._id : null : data?.guestDonor ? data.guestDonor._id : null;

    if(data.type == 'GUEST-APPOINTMENT' && data.guestDonor && !donors.includes(data.guestDonor)){
      setDonors([...donors, data.guestDonor])
    }

    reset({
      _id: data._id,
      datetime: new Date(data.datetime),
      user: userId as unknown as string,
      hospital: data.hospital._id as string,
      remarks: data.remarks,
      status: data.status,
    })
    setOpenModal(true)
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId)
      setTransactions(transactions.filter(t => t._id !== transactionId))
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

  const openCreateDialog = () => {
    reset({
      hospital: '',
      datetime: new Date(),
      status: 'PENDING',
      remarks: '',
      user: '',
    })
    setIsCreateDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-full min-w-full bg-[#F8EFEF] p-8">
        <div className="text-center text-[#4A1515]">Loading...</div>
      </div>
    )
  }

  const getDonorName =  (transaction: Transaction): String => {
    let username = 'N/A';
    if(transaction.type == 'MEMBER-APPOINTMENT'){
      username = transaction?.user ? username = transaction.user.username : 'N/A';
    }else{
      username = transaction?.guestDonor ? username = transaction.guestDonor.username : 'N/A';
    }
    return username
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" /> Create Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Transaction</DialogTitle>
                <DialogDescription>
                  Enter the details for the new transaction.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(handleCreateTransaction)}>
                <div className="grid gap-4 py-4">
                  <div className="grid items-center grid-cols-4 gap-4">
                    <Label htmlFor="donor" className="text-right">
                      Donor
                    </Label>
                    <Controller
                      name="user"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select Donor" />
                          </SelectTrigger>
                          <SelectContent>
                            {donors.filter(donor => donor.donorId).map(donor => (
                              <SelectItem key={donor._id} value={donor._id || ''}>
                                {donor.username} - {donor.address}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.user && <p className="text-sm text-red-500">{errors.user.message}</p>}
                    <Label htmlFor="datetime" className="text-right">
                      Date & Time
                    </Label>
                    <Controller
                      name="datetime"
                      control={control}
                      render={({ field }) => (
                        <div className="flex col-span-3 gap-2">
                          <Input
                            type="date"
                            value={format(field.value, 'yyyy-MM-dd')}
                            onChange={(e) => {
                              const newDate = parse(e.target.value, 'yyyy-MM-dd', new Date());
                              field.onChange(newDate);
                            }}
                            className="flex-1"
                          />
                          <Select
                            value={format(field.value, 'hh:mm a')}
                            onValueChange={(time) => {
                              const newDate = parse(time, 'hh:mm a', field.value);
                              field.onChange(newDate);
                            }}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 * 2 }).map((_, index) => {
                                const minutes = index * 30;
                                const hour = Math.floor(minutes / 60);
                                const minute = minutes % 60;
                                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                                return (
                                  <SelectItem key={time} value={format(parse(time, 'HH:mm', new Date()), 'hh:mm a')}>
                                    {format(parse(time, 'HH:mm', new Date()), 'hh:mm a')}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {errors.datetime && <p className="text-sm text-red-500">{errors.datetime.message}</p>}
                  </div>
                  <div className="grid items-center grid-cols-4 gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="SUCCESS">Success</SelectItem>
                            <SelectItem value="REJECT">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
                  </div>
                  <div className="grid items-center grid-cols-4 gap-4">
                    <Label htmlFor="remarks" className="text-right">
                      Remarks
                    </Label>
                    <Controller
                      name="remarks"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          id="remarks"
                          {...field}
                          className="col-span-3"
                          placeholder="Enter remarks"
                        />
                      )}
                    />
                    {errors.remarks && <p className="text-sm text-red-500">{errors.remarks.message}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hospital</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Donor</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{transaction.hospital.username}</TableCell>
                <TableCell>{format(new Date(transaction.datetime), 'MMM d, yyyy hh:mm a')}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    transaction.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' :
                    transaction.status === 'SUCCESS' ? 'bg-green-200 text-green-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </TableCell>
                <TableCell>{transaction.remarks}</TableCell>
                <TableCell>{getDonorName(transaction)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleUpdateDonor(transaction)}>
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
                        <AlertDialogAction onClick={() => transaction._id && handleDeleteTransaction(transaction._id)}>
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

        <Dialog open={!!openModal} onOpenChange={() => setOpenModal(false)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
              <DialogDescription>
                Update the details of this transaction.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleCreateTransaction)}>
                <div className="grid gap-4 py-4">
                  <div className="grid items-center grid-cols-4 gap-4">
                    <Label htmlFor="edit-hospital" className="text-right">
                      Hospital
                    </Label>
                    <Controller
                      name="hospital"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} disabled={true}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select hospital" />
                          </SelectTrigger>
                          <SelectContent>
                            {hospitals.map(hospital => (
                            <SelectItem key={hospital._id} value={hospital._id}>
                              {hospital.username} - {hospital.address}
                            </SelectItem>
                          ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.hospital && <p className="text-sm text-red-500">{errors.hospital.message}</p>}
                  </div>
                  <div className="grid items-center grid-cols-4 gap-4">
                    <Label htmlFor="edit-donor" className="text-right">
                      Donor
                    </Label>
                    <Controller
                      name="user"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} disabled={true}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select Donor" />
                          </SelectTrigger>
                          <SelectContent>
                            {donors.map(donor => (
                              <SelectItem key={donor._id} value={donor._id || ''}>
                                {donor.username} - {donor.address}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.user && <p className="text-sm text-red-500">{errors.user.message}</p>}
                  </div>
                  <div className="grid items-center grid-cols-4 gap-4">
                    <Label htmlFor="edit-datetime" className="text-right">
                      Date & Time
                    </Label>
                    <Controller
                      name="datetime"
                      control={control}
                      render={({ field }) => (
                        <div className="flex col-span-3 gap-2">
                          <Input
                            type="date"
                            value={format(field.value, 'yyyy-MM-dd')}
                            onChange={(e) => {
                              const newDate = parse(e.target.value, 'yyyy-MM-dd', new Date());
                              field.onChange(newDate);
                            }}
                            className="flex-1"
                          />
                          <Select
                            value={format(field.value, 'hh:mm a')}
                            onValueChange={(time) => {
                              const newDate = parse(time, 'hh:mm a', field.value);
                              field.onChange(newDate);
                            }}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 * 2 }).map((_, index) => {
                                const minutes = index * 30;
                                const hour = Math.floor(minutes / 60);
                                const minute = minutes % 60;
                                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                                return (
                                  <SelectItem key={time} value={format(parse(time, 'HH:mm', new Date()), 'hh:mm a')}>
                                    {format(parse(time, 'HH:mm', new Date()), 'hh:mm a')}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {errors.datetime && <p className="text-sm text-red-500">{errors.datetime.message}</p>}
                  </div>
                  <div className="grid items-center grid-cols-4 gap-4">
                    <Label htmlFor="edit-status" className="text-right">
                      Status
                    </Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="SUCCESS">Success</SelectItem>
                            <SelectItem value="REJECT">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
                  </div>
                  <div className="grid items-center grid-cols-4 gap-4">
                    <Label htmlFor="edit-remarks" className="text-right">
                      Remarks
                    </Label>
                    <Controller
                      name="remarks"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          id="edit-remarks"
                          {...field}
                          className="col-span-3"
                          placeholder="Enter remarks"
                        />
                      )}
                    />
                    {errors.remarks && <p className="text-sm text-red-500">{errors.remarks.message}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <Button type='submit'>{control._formValues._id ? 'Update' : 'Create'}</Button>
                </DialogFooter>
              </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default BloodSupplyPage

