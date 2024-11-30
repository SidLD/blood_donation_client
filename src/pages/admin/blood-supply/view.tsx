'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

interface BloodSupply {
  type: string
  percentage: number
  color: string
}

const dummyBloodData: BloodSupply[] = [
  { type: 'A+', percentage: 54, color: '#4A1515' },
  { type: 'B+', percentage: 18, color: '#D88E8E' },
  { type: 'AB+', percentage: 28, color: '#2D0C0C' }
]

const BloodSupplyPage: React.FC = () => {
  const [bloodData, setBloodData] = useState<BloodSupply[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBloodSupply = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setBloodData(dummyBloodData)
      setIsLoading(false)
    }

    fetchBloodSupply()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-full min-w-full bg-[#F8EFEF] p-8">
        <div className="text-center text-[#4A1515]">Loading...</div>
      </div>
    )
  }

  // Prepare data for the Pie chart
  const pieData = {
    labels: bloodData.map((blood) => blood.type),
    datasets: [
      {
        data: bloodData.map((blood) => blood.percentage),
        backgroundColor: bloodData.map((blood) => blood.color),
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
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
      <div className="max-w-5xl p-8 mx-auto">
        <h1 className="text-3xl font-bold text-[#4A1515] mb-8">
          Blood Supply Levels
        </h1>

        <div className="grid items-center gap-8 mb-12 md:grid-cols-2">
          {/* 2D Pie Chart */}
          <div className="h-[400px] w-full">
            <Pie data={pieData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function (context: any) {
                      return `${context.label}: ${context.raw}%`
                    }
                  }
                }
              }
            }} />
          </div>

          {/* Progress Bars */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#4A1515] mb-4">
              December 2024
            </h2>
            {bloodData.map((blood) => (
              <div key={blood.type} className="space-y-2">
                <div className="flex justify-between text-[#4A1515]">
                  <span>{blood.type}</span>
                  <span>{blood.percentage}%</span>
                </div>
                <div className="h-8 overflow-hidden rounded-full bg-white/50">
                  <div
                    className="h-full transition-all duration-1000 rounded-full"
                    style={{
                      width: `${blood.percentage}%`,
                      backgroundColor: blood.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BloodSupplyPage
