'use client'

import React, { useState } from 'react'

interface DigimonFormProps {
  digimon?: any
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export function DigimonForm({ onCancel, onSubmit, isLoading }: DigimonFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    level: 'Rookie',
    type: 'Vaccine',
    description: '',
    imageUrl: '',
    attackPower: '100',
    defenseValue: '100'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error al crear Digimon:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Crear Nuevo Digimon
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Agumon"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Fresh">Fresh</option>
              <option value="In-Training">In-Training</option>
              <option value="Rookie">Rookie</option>
              <option value="Champion">Champion</option>
              <option value="Ultimate">Ultimate</option>
              <option value="Mega">Mega</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Vaccine">Vaccine</option>
              <option value="Data">Data</option>
              <option value="Virus">Virus</option>
              <option value="Free">Free</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Describe a tu Digimon..."
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || !formData.name.trim() || !formData.description.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Creando...' : 'Crear Digimon'}
          </button>
        </div>
      </form>
    </div>
  )
}