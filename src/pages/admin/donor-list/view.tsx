'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CertifiedDonorsTab } from './_components/certified-donor-tab'
import { VerifyDonorIdTab } from './_components/donor-number-tab'
import { NewDonorsTab } from './_components/new-donor-tab'
import { generateDonorNumber, getHospitalDonorsByCategory } from '@/lib/api'
import { Donor } from '@/types/user'

export type DonorView = 'certified' | 'new' | 'verify'

export interface Transaction {
  _id: string;
  user: string;
  datetime: string;
  status: string;
  hospital: string;
  createdAt: string;
  updatedAt: string;
  remarks?: string;
}

export interface DonorNumber {
  _id: string;
  donorId: string;
  isUsed: boolean;
  isVerified: boolean;
  hospital: string;
  createdAt: string;
  updatedAt: string;
}
export interface DonorData {
  certified: Donor[];
  new: Donor[];
}

export default function DonorsPage() {
  const [view, setView] = useState<DonorView>('certified')
  const [searchQuery, setSearchQuery] = useState('')
  const [donorData, setDonorData] = useState<DonorData>({ certified: [], new: [] })
  const [filteredDonors, setFilteredDonors] = useState<DonorData>({ certified: [], new: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [showDonorIdModal, setShowDonorIdModal] = useState(false)
  const [donorIdInput, setDonorIdInput] = useState('')

  const fetchDonors = async () => {
    setIsLoading(true);
    try {
      const {data} = await getHospitalDonorsByCategory() as unknown as any
      if(data.length){
        const categorizedDonors: DonorData = {
          certified: data.filter((donor: any) => donor.isCertified),
          new: data.filter((donor: any) => !donor.isCertified)
        };
        setDonorData(categorizedDonors);
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDonor = () => {
    setFilteredDonors({
      certified: donorData.certified,
      new: donorData.new
    })
  }

  useEffect(() => {
    fetchDonors()
  }, [])
  
  useEffect(() => {
    filterDonor()
  }, [view, donorData])

  useEffect(() => {
    if (view === 'verify') {
      setFilteredDonors({certified: [], new: []});
      return;
    }

    if (searchQuery.trim() === '') {
      setFilteredDonors(donorData);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered: DonorData = {
      certified: donorData.certified.filter(donor => 
        donor.donorNumbers.donorId.toLowerCase().includes(query) ||
        donor.username.toLowerCase().includes(query) ||
        donor.bloodType.toLowerCase().includes(query)
      ),
      new: donorData.new.filter(donor => 
        donor.donorNumbers.donorId.toLowerCase().includes(query) ||
        donor.username.toLowerCase().includes(query) ||
        donor.bloodType.toLowerCase().includes(query)
      )
    };
    setFilteredDonors(filtered);
  }, [searchQuery, donorData, view])

  const handleVerifyDonorId = async () => {
    await generateDonorNumber({donorId: donorIdInput})
    setDonorIdInput('')
    setShowDonorIdModal(false)
  }

  return (
    <div className="min-h-full min-w-full bg-[#4A1515]">
      <div className="max-w-6xl px-4 py-6 mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <a 
            href="/admin"
            className="flex items-center text-white hover:opacity-80"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="text-xl">Donors</span>
          </a>
        </div>

        {/* Tabs */}
        <div className="flex mb-4">
          <button
            onClick={() => setView('certified')}
            className={`px-6 py-2 text-xl rounded-t-lg ${
              view === 'certified'
                ? 'bg-[#D88E8E] text-[#4A1515] font-semibold'
                : 'bg-[#4A1515] text-white'
            }`}
          >
            Certified Donors
          </button>
          <button
            onClick={() => setView('new')}
            className={`px-6 py-2 text-xl rounded-t-lg ${
              view === 'new'
                ? 'bg-[#D88E8E] text-[#4A1515] font-semibold'
                : 'bg-[#4A1515] text-white'
            }`}
          >
            New Donors
          </button>
          <button
            onClick={() => setView('verify')}
            className={`px-6 py-2 text-xl rounded-t-lg ${
              view === 'verify'
                ? 'bg-[#D88E8E] text-[#4A1515] font-semibold'
                : 'bg-[#4A1515] text-white'
            }`}
          >
            Verify Donor ID
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Enter Donor ID, name, etc."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-6 py-2 text-gray-800 placeholder-gray-500 rounded-full bg-white/80 backdrop-blur-sm"
          />
        </div>

        {/* Content Area */}
        <div className="bg-[#D88E8E] p-6 rounded-lg">
          {view === 'certified' && (
            <CertifiedDonorsTab 
              donors={filteredDonors.certified} 
              isLoading={isLoading} 
            />
          )}
          {view === 'new' && (
            <NewDonorsTab 
              donors={filteredDonors.new} 
              isLoading={isLoading} 
            />
          )}
          {view === 'verify' && (
            <VerifyDonorIdTab 
              onOpenModal={() => setShowDonorIdModal(true)} 
            />
          )}
        </div>
      </div>

      {/* Donor ID Input Modal */}
      <Dialog open={showDonorIdModal} onOpenChange={setShowDonorIdModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Input Donor ID</DialogTitle>
          </DialogHeader>
          <input
            type="text"
            value={donorIdInput}
            onChange={(e) => setDonorIdInput(e.target.value)}
            className="w-full px-4 py-2 text-gray-800 placeholder-gray-500 rounded-full bg-white/80 backdrop-blur-sm"
            placeholder="Enter Donor ID"
          />
          <Button onClick={handleVerifyDonorId}>Verify</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

