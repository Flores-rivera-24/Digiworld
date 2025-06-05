'use client'

import React, { useState, useEffect } from 'react'

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

interface DigimonFormProps {
  digimon?: SimpleDigimon | null
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isLoading: boolean
  mode?: 'create' | 'edit'
}

export function DigimonForm({ digimon, onCancel, onSubmit, isLoading, mode = 'create' }: DigimonFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    level: 'Rookie',
    type: 'Vaccine',
    description: '',
    imageUrl: '',
    attackPower: '100',
    defenseValue: '100'
  })

  // Update form data when digimon prop changes (for editing)
  useEffect(() => {
    if (digimon && mode === 'edit') {
      setFormData({
        name: digimon.name,
        level: digimon.level,
        type: digimon.type,
        description: digimon.description,
        imageUrl: digimon.imageUrl || '',
        attackPower: digimon.attackPower.toString(),
        defenseValue: digimon.defenseValue.toString()
      })
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        level: 'Rookie',
        type: 'Vaccine',
        description: '',
        imageUrl: '',
        attackPower: '100',
        defenseValue: '100'
      })
    }
  }, [digimon, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const submitData = mode === 'edit' && digimon 
        ? { ...formData, id: digimon.id }
        : formData
      await onSubmit(submitData)
    } catch (error) {
      console.error(`Error al ${mode === 'edit' ? 'actualizar' : 'crear'} Digimon:`, error)
    }
  }

  const isEditMode = mode === 'edit'

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? `Modificar ${digimon?.name || 'Digimon'}` : 'Crear Nuevo Digimon'}
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

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poder de Ataque *
            </label>
            <input
              type="number"
              value={formData.attackPower}
              onChange={(e) => setFormData({...formData, attackPower: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="999"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor de Defensa *
            </label>
            <input
              type="number"
              value={formData.defenseValue}
              onChange={(e) => setFormData({...formData, defenseValue: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="999"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de Imagen (opcional)
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://ejemplo.com/imagen.jpg"
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
            className={`px-6 py-2 text-white rounded-md disabled:opacity-50 transition-colors ${
              isEditMode 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading 
              ? (isEditMode ? 'Guardando...' : 'Creando...') 
              : (isEditMode ? 'Guardar Cambios' : 'Crear Digimon')
            }
          </button>
        </div>
      </form>
    </div>
  )
}