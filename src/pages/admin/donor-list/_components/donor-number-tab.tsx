'use client'

import { Button } from "@/components/ui/button"
import { getDonorNumber, deleteDonorNumber } from "@/lib/api"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from 'lucide-react'
import { donorNumber } from "@/types/user"

interface VerifyDonorIdTabProps {
  onOpenModal: () => void
}

export function VerifyDonorIdTab({ onOpenModal }: VerifyDonorIdTabProps) {
  const [donorIds, setDonorIds] = useState<donorNumber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDonorIds()
  }, [])

  const fetchDonorIds = async () => {
    setIsLoading(true)
    try {
      const {data} = await getDonorNumber() as unknown as any
      if (data.donorNumberData.length > 0) {
        setDonorIds(data.donorNumberData)
      } else {
        setDonorIds([])
      }
    } catch (error) {
      console.error('Error fetching donor IDs:', error)
      toast({
        title: "Error",
        description: "Failed to fetch donor IDs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDonorNumber({donorId: id})
      setDonorIds(donorIds.filter(donor => donor._id !== id))
      toast({
        title: "Success",
        description: "Donor ID deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting donor ID:', error)
      toast({
        title: "Error",
        description: "Failed to delete donor ID. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6">
      <Button 
        onClick={onOpenModal}
        className="mb-6 text-white bg-white/10 hover:bg-white/20"
      >
        Input Donor ID
      </Button>
      <div className="mt-4 bg-[#E5A4A4]/60 backdrop-blur-md rounded-xl p-6">
        <h3 className="mb-4 text-xl font-semibold text-white">Verified Donor IDs</h3>
        {isLoading ? (
          <p className="text-white/90">Loading donor IDs...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-white border-b border-white/20">
                <th className="px-4 py-2">Donor ID</th>
                <th className="px-4 py-2">Verification Status</th>
                <th className="px-4 py-2">Usage Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donorIds.map((donor) => (
                <tr 
                  key={donor._id} 
                  className="border-b text-white/90 border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3">{donor.donorId}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      donor.isVerified ? 'text-green-100 bg-green-500/20' : 'text-yellow-100 bg-yellow-500/20'
                    }`}>
                      {donor.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      donor.isUsed ? 'text-blue-100 bg-blue-500/20' : 'text-gray-100 bg-gray-500/20'
                    }`}>
                      {donor.isUsed ? 'Used' : 'Unused'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!donor.isUsed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(donor._id)}
                        className="text-white/90 hover:text-white hover:bg-white/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

