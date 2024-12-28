import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Donor } from "@/types/user"
import { Mail, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import emailjs from '@emailjs/browser'

interface CertifiedDonorsTabProps {
  donors: Donor[]
  isLoading: boolean
}

export function CertifiedDonorsTab({ donors, isLoading }: CertifiedDonorsTabProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null)
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSendEmail = (donor: Donor) => {
    setSelectedDonor(donor)
    setIsEmailModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { subject, message } = formData

    if (!subject || !message) {
      setStatus("Please fill in all fields.")
      return
    }

    setIsSending(true)

    try {
      await emailjs.send(
        "service_ggd75wn", 
        "template_1y93iy2",  
        {
          fullName: selectedDonor?.username,
          email: selectedDonor?.email,
          subject,
          message,
        },
        "_dY3cpAn70Y3oTEjp" 
      )
      setStatus("Message sent successfully!")
      setFormData({ subject: "", message: "" })
      setIsEmailModalOpen(false)
    } catch (error) {
      setStatus("An error occurred. Please try again later.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Certified Donors</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : donors.length === 0 ? (
          <div className="py-8 text-center text-white">
            <p className="text-lg font-semibold">No certified donors found</p>
            <p className="text-sm text-white/70">Certified donors will appear here once approved.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Donor ID</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Blood Type</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donors.map((donor) => (
                  <TableRow key={donor._id} className="text-white/90 hover:bg-white/5">
                    <TableCell>{donor.donorId}</TableCell>
                    <TableCell>{donor.username}</TableCell>
                    <TableCell>{donor.bloodType}</TableCell>
                    <TableCell>{donor.status}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendEmail(donor)}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Send an email to this donor</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Send Email to {selectedDonor?.username}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="subject" className="text-right">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="message" className="text-right">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSending}>
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending
                    </>
                  ) : (
                    'Send Email'
                  )}
                </Button>
              </DialogFooter>
            </form>
            {status && <p className="mt-4 text-center text-white">{status}</p>}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

