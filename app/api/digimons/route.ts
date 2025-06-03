import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateDigimonData, DigimonValidationError } from '@/lib/validations'

export async function GET() {
  try {
    const digimons = await prisma.digimon.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: digimons 
    })
  } catch (error) {
    console.error('Error fetching Digimons:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al obtener los Digimons' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validationErrors = validateDigimonData(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos de validación incorrectos',
          validationErrors
        },
        { status: 400 }
      )
    }

    // Check for duplicate name
    const existingDigimon = await prisma.digimon.findUnique({
      where: { name: body.name }
    })

    if (existingDigimon) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ya existe un Digimon con ese nombre'
        },
        { status: 409 }
      )
    }

    const newDigimon = await prisma.digimon.create({
      data: {
        name: body.name,
        level: body.level,
        type: body.type,
        description: body.description,
        imageUrl: body.imageUrl || null,
        attackPower: parseInt(body.attackPower),
        defenseValue: parseInt(body.defenseValue)
      }
    })

    return NextResponse.json(
      { 
        success: true, 
        data: newDigimon,
        message: 'Digimon creado exitosamente'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating Digimon:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al crear el Digimon' 
      },
      { status: 500 }
    )
  }
}