'use client'

import { useState } from 'react'

// Tipos básicos para mientras
interface SimpleDigimon {
  id: number
  name: string
  level: string
  type: string
  description: string
  imageUrl: string
  attackPower: number
  defenseValue: number
  createdAt: Date
}

interface CreateDigimonData {
  name: string
  level: string
  type: string
  description: string
  imageUrl: string
  attackPower: string
  defenseValue: string
}

export function useDigimons() {
  const [digimons, setDigimons] = useState<SimpleDigimon[]>([]) // ✅ Tipo específico
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDigimon = async (data: CreateDigimonData) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Creando Digimon:', data)
      
      // Simular un delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newDigimon: SimpleDigimon = {
        id: Date.now(),
        name: data.name,
        level: data.level,
        type: data.type,
        description: data.description,
        imageUrl: data.imageUrl,
        attackPower: parseInt(data.attackPower) || 100,
        defenseValue: parseInt(data.defenseValue) || 100,
        createdAt: new Date()
      }
      
      setDigimons(prev => [newDigimon, ...prev]) 
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateDigimon = async (data: any) => {
    console.log('Actualizando Digimon:', data)
  }

  const deleteDigimon = async (id: number) => {
    setDigimons(prev => prev.filter(digimon => digimon.id !== id))
  }

  const fetchDigimons = async () => {
    console.log('Obteniendo Digimons')
  }

  return {
    digimons,
    loading,
    error,
    createDigimon,
    updateDigimon,
    deleteDigimon,
    fetchDigimons
  }
}