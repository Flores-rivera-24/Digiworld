'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface Digimon {
  id: number
  name: string
  level: string
  type: string
  description: string
  hp: number
  mp: number
  offense: number
  defense: number
  speed: number
  brain: number
  imageUrl?: string
  createdAt: Date
}

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)
  const [digimons, setDigimons] = useState<Digimon[]>([])
  const [loading, setLoading] = useState(false)
  const [searchingImage, setSearchingImage] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    level: 'Rookie',
    type: 'Vaccine',
    description: '',
    hp: '1000',
    mp: '500',
    offense: '100',
    defense: '100',
    speed: '50',
    brain: '50',
    imageUrl: ''
  })

  useEffect(() => {
    fetchDigimons()
  }, [])

  const fetchDigimons = async () => {
    try {
      const response = await fetch('/api/digimons')
      const result = await response.json()
      if (result.success) {
        setDigimons(result.data)
      }
    } catch (error) {
      console.error('Error fetching Digimons:', error)
    }
  }

  // Función para buscar imagen del Digimon en la API
  const searchDigimonImage = async (name: string) => {
    if (!name.trim()) return null

    setSearchingImage(true)
    try {
      // API gratuita de Digimon
      const response = await fetch(`https://digimon-api.vercel.app/api/digimon/name/${encodeURIComponent(name)}`)

      if (response.ok) {
        const data = await response.json()
        if (data && data[0] && data[0].img) {
          return data[0].img
        }
      }

      // Si no encuentra, buscar similar
      const searchResponse = await fetch('https://digimon-api.vercel.app/api/digimon')
      if (searchResponse.ok) {
        const allDigimon = await searchResponse.json()
        const similar = allDigimon.find((d: any) =>
          d.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(d.name.toLowerCase())
        )
        if (similar && similar.img) {
          return similar.img
        }
      }

      return null
    } catch (error) {
      console.error('Error buscando imagen:', error)
      return null
    } finally {
      setSearchingImage(false)
    }
  }

  // Función para buscar imagen automáticamente
  const handleSearchImage = async () => {
    const imageUrl = await searchDigimonImage(formData.name)
    if (imageUrl) {
      setFormData(prev => ({ ...prev, imageUrl }))
    } else {
      alert('No se encontró imagen para este Digimon. Puedes agregar una URL manualmente.')
    }
  }

  const handleCreateClick = () => {
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setFormData({
      name: '',
      level: 'Rookie',
      type: 'Vaccine',
      description: '',
      hp: '1000',
      mp: '500',
      offense: '100',
      defense: '100',
      speed: '50',
      brain: '50',
      imageUrl: ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Si no hay imagen, intentar buscar una automáticamente
      let finalImageUrl = formData.imageUrl
      if (!finalImageUrl && formData.name.trim()) {
        finalImageUrl = await searchDigimonImage(formData.name) || ''
      }

      const newDigimon: Digimon = {
        id: Date.now(),
        name: formData.name,
        level: formData.level,
        type: formData.type,
        description: formData.description,
        hp: parseInt(formData.hp),
        mp: parseInt(formData.mp),
        offense: parseInt(formData.offense),
        defense: parseInt(formData.defense),
        speed: parseInt(formData.speed),
        brain: parseInt(formData.brain),
        imageUrl: finalImageUrl,
        createdAt: new Date()
      }

      setDigimons(prev => [newDigimon, ...prev])
      setShowForm(false)
      handleCancel()

      console.log('Digimon creado:', newDigimon)

    } catch (error) {
      console.error('Error al crear Digimon:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: number) => {
    setDigimons(prev => prev.filter(digimon => digimon.id !== id))
  }

  const getTypeColor = (type: string) => {
    const colors = {
      Vaccine: 'bg-green-100 text-green-800 border-green-200',
      Data: 'bg-blue-100 text-blue-800 border-blue-200',
      Virus: 'bg-red-100 text-red-800 border-red-200',
      Free: 'bg-purple-100 text-purple-800 border-purple-200'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      Vaccine: '💉',
      Data: '💾',
      Virus: '🦠',
      Free: '🆓'
    }
    return icons[type as keyof typeof icons] || '❓'
  }

  const calculateTotalStats = (digimon: Digimon) => {
    return digimon.offense + digimon.defense + digimon.speed + digimon.brain
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            DigiWorld Manager
          </h1>
          <p className="text-lg text-gray-600">
            Administra tu colección de Digimons
          </p>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Crear Nuevo Digimon
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Información Básica */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Información Básica</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Agumon"
                        required
                      />
                      <button
                        type="button"
                        onClick={handleSearchImage}
                        disabled={!formData.name.trim() || searchingImage}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        {searchingImage ? '🔍...' : ' Buscar Imagen'}
                      </button>
                    </div>
                  </div>

                  {/* ✅ Campo de imagen */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de Imagen (Opcional)
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={formData.imageUrl}
                            alt="Preview"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                            onError={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nivel de Evolución
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Fresh">🥚 Fresh (Baby I)</option>
                        <option value="In-Training">🐣 In-Training (Baby II)</option>
                        <option value="Rookie">🦎 Rookie (Child)</option>
                        <option value="Champion">🦖 Champion (Adult)</option>
                        <option value="Ultimate">🐲 Ultimate (Perfect)</option>
                        <option value="Mega">👑 Mega (Ultimate)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Digimon
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Vaccine">💉 Vaccine (Protector)</option>
                        <option value="Data">💾 Data (Normal)</option>
                        <option value="Virus">🦠 Virus (Destructor)</option>
                        <option value="Free">🆓 Free (Variable)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sistema de Stats - Mantener igual que antes */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Stats </h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-red-600 mb-2">
                        ❤️ HP (Hit Points)
                      </label>
                      <input
                        type="number"
                        value={formData.hp}
                        onChange={(e) => setFormData({ ...formData, hp: e.target.value })}
                        className="w-full px-3 py-2 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        min="100"
                        max="9999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-600 mb-2">
                        💧 MP (Magic Points)
                      </label>
                      <input
                        type="number"
                        value={formData.mp}
                        onChange={(e) => setFormData({ ...formData, mp: e.target.value })}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="50"
                        max="9999"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-orange-600 mb-2">
                        ⚔️ Offense
                      </label>
                      <input
                        type="number"
                        value={formData.offense}
                        onChange={(e) => setFormData({ ...formData, offense: e.target.value })}
                        className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        min="1"
                        max="999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-600 mb-2">
                        🛡️ Defense
                      </label>
                      <input
                        type="number"
                        value={formData.defense}
                        onChange={(e) => setFormData({ ...formData, defense: e.target.value })}
                        className="w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        min="1"
                        max="999"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-yellow-600 mb-2">
                        ⚡ Speed
                      </label>
                      <input
                        type="number"
                        value={formData.speed}
                        onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                        className="w-full px-3 py-2 border border-yellow-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        min="1"
                        max="300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-purple-600 mb-2">
                        🧠 Brain
                      </label>
                      <input
                        type="number"
                        value={formData.brain}
                        onChange={(e) => setFormData({ ...formData, brain: e.target.value })}
                        className="w-full px-3 py-2 border border-purple-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="1"
                        max="300"
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe a tu Digimon..."
                    required
                  />
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.name.trim() || !formData.description.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Creando...' : 'Crear Digimon'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!showForm && (
          <div className="text-center mb-8">
            <button
              onClick={handleCreateClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              ➕ Crear Nuevo Digimon
            </button>
          </div>
        )}

        {/* Lista de Digimons */}
        {digimons.length === 0 && !showForm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay Digimons registrados</h3>
            <p className="text-gray-500">Crea tu primer Digimon para comenzar tu aventura digital</p>
          </div>
        )}

        {/* ✅ Grid de Digimons con imágenes reales */}
        {digimons.length > 0 && !showForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {digimons.map((digimon) => (
              <div key={digimon.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* ✅ Header con imagen real del Digimon */}
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                  {digimon.imageUrl ? (
                    <Image
                      src={digimon.imageUrl}
                      alt={digimon.name}
                      width={192}
                      height={192}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = '<div class="text-4xl">🔥</div>'
                        }
                      }}
                    />
                  ) : (
                    <div className="text-4xl">🔥</div>
                  )}
                </div>

                {/* Contenido - igual que antes */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{digimon.name}</h3>
                    <span className="text-sm text-gray-500">#{digimon.id}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(digimon.type)}`}>
                      {getTypeIcon(digimon.type)} {digimon.type}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 border border-gray-200 rounded-full text-sm font-medium">
                      {digimon.level}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-red-50 border border-red-200 p-2 rounded text-center">
                      <div className="text-lg font-bold text-red-600">❤️ {digimon.hp}</div>
                      <div className="text-xs text-red-500">Hit Points</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-2 rounded text-center">
                      <div className="text-lg font-bold text-blue-600">💧 {digimon.mp}</div>
                      <div className="text-xs text-blue-500">Magic Points</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1 mb-3">
                    <div className="text-center">
                      <div className="text-sm font-bold text-orange-600">{digimon.offense}</div>
                      <div className="text-xs text-orange-500">⚔️ ATK</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-600">{digimon.defense}</div>
                      <div className="text-xs text-green-500">🛡️ DEF</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-yellow-600">{digimon.speed}</div>
                      <div className="text-xs text-yellow-500">⚡ SPD</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-purple-600">{digimon.brain}</div>
                      <div className="text-xs text-purple-500">🧠 INT</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-2 rounded mb-3 text-center">
                    <div className="text-sm font-bold text-gray-700">
                      Total Combat: {calculateTotalStats(digimon)} pts
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {digimon.description.length > 60
                      ? `${digimon.description.substring(0, 60)}...`
                      : digimon.description
                    }
                  </p>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleDelete(digimon.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}