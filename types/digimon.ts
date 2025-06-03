export interface Digimon {
  id: number
  name: string
  level: DigimonLevel
  type: DigimonType
  description: string
  imageUrl?: string | null
  attackPower: number
  defenseValue: number
  createdAt: Date
  updatedAt: Date
}

export type DigimonLevel = 'Fresh' | 'In-Training' | 'Rookie' | 'Champion' | 'Ultimate' | 'Mega'
export type DigimonType = 'Vaccine' | 'Data' | 'Virus' | 'Free'


export interface CreateDigimonRequest {
  name: string
  level: DigimonLevel
  type: DigimonType
  description: string
  imageUrl?: string
  attackPower: number
  defenseValue: number
}

export interface UpdateDigimonRequest extends Partial<CreateDigimonRequest> {
  id: number
}

export interface DigimonFormData {
  name: string
  level: DigimonLevel
  type: DigimonType
  description: string
  imageUrl: string
  attackPower: string
  defenseValue: string
}