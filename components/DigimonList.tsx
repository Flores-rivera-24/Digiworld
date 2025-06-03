'use client'

import React from 'react'

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

interface DigimonListProps {
  digimons: SimpleDigimon[]
  onEdit: (digimon: SimpleDigimon) => void
  onDelete: (id: number) => Promise<void>
  isLoading: boolean
}

export function DigimonList({ digimons, onDelete, isLoading }: DigimonListProps) {
  if (digimons.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🌟</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay Digimons registrados</h3>
        <p className="text-gray-500">Crea tu primer Digimon para comenzar tu aventura digital</p>
      </div>
    )
  }

  const getTypeColor = (type: string) => {
    const colors = {
      Vaccine: 'bg-green-100 text-green-800',
      Data: 'bg-blue-100 text-blue-800',
      Virus: 'bg-red-100 text-red-800',
      Free: 'bg-purple-100 text-purple-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {digimons.map((digimon) => (
        <div key={digimon.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header del Digimon */}
          <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-4xl">🔥</div>
          </div>

          {/* Contenido */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900">{digimon.name}</h3>
              <span className="text-sm text-gray-500">#{digimon.id}</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(digimon.type)}`}>
                {digimon.type}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                {digimon.level}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{digimon.attackPower}</div>
                <div className="text-xs text-gray-500">Ataque</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{digimon.defenseValue}</div>
                <div className="text-xs text-gray-500">Defensa</div>
              </div>
            </div>

            {/* Descripción */}
            <p className="text-gray-600 text-sm mb-4">
              {digimon.description.length > 60 
                ? `${digimon.description.substring(0, 60)}...` 
                : digimon.description
              }
            </p>

            {/* Acciones */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => onDelete(digimon.id)}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}