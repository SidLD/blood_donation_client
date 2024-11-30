'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

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

const PieSlice: React.FC<{ data: BloodSupply; startAngle: number; endAngle: number }> = ({ data, startAngle, endAngle }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current) {
      // meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
      //   meshRef.current.material.emissiveIntensity,
      //   hovered ? 0.5 : 0,
      //   0.1
      // )
    }
  })

  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.arc(0, 0, 1, startAngle, endAngle, false)
  shape.lineTo(0, 0)

  const extrudeSettings = {
    steps: 1,
    depth: 0.1,
    bevelEnabled: false,
  }

  const midAngle = (startAngle + endAngle) / 2
  const labelPosition = new THREE.Vector3(
    Math.cos(midAngle) * 0.7,
    Math.sin(midAngle) * 0.7,
    0.06
  )

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshPhongMaterial 
          color={data.color} 
          emissive={data.color}
          emissiveIntensity={0}
          shininess={100}
        />
      </mesh>
      <Text
        position={labelPosition}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {`${data.type}: ${data.percentage}%`}
      </Text>
    </group>
  )
}

const PieChart3D: React.FC<{ data: BloodSupply[] }> = ({ data }) => {
  const totalPercentage = data.reduce((sum, item) => sum + item.percentage, 0)
  let startAngle = 0

  return (
    <Canvas camera={{ position: [0, 2, 0], fov: 50, up: [0, 0, 1] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {data.map((item, _index) => {
          const angle = (item.percentage / totalPercentage) * Math.PI * 2
          const endAngle = startAngle + angle
          const slice = (
            <PieSlice
              key={item.type}
              data={item}
              startAngle={startAngle}
              endAngle={endAngle}
            />
          )
          startAngle = endAngle
          return slice
        })}
      </group>
    </Canvas>
  )
}

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
          {/* 3D Pie Chart */}
          <div className="h-[400px] w-full">
            <PieChart3D data={bloodData} />
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

