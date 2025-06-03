import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateDigimonData } from '@/lib/validations'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const digimonId = parseInt(params.id)
    
    if (isNaN(digimonId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de Digimon inválido' 
        },
        { status: 400 }
      )
    }

    const digimon = await prisma.digimon.findUnique({
      where: { id: digimonId }
    })

    if (!digimon) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Digimon no encontrado' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: digimon 
    })
  } catch (error) {
    console.error('Error fetching Digimon:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const digimonId = parseInt(params.id)
    
    if (isNaN(digimonId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de Digimon inválido' 
        },
        { status: 400 }
      )
    }

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

    // Check if Digimon exists
    const existingDigimon = await prisma.digimon.findUnique({
      where: { id: digimonId }
    })

    if (!existingDigimon) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Digimon no encontrado' 
        },
        { status: 404 }
      )
    }

    // Check for duplicate name (excluding current Digimon)
    const duplicateDigimon = await prisma.digimon.findFirst({
      where: { 
        name: body.name,
        id: { not: digimonId }
      }
    })

    if (duplicateDigimon) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ya existe otro Digimon con ese nombre'
        },
        { status: 409 }
      )
    }

    const updatedDigimon = await prisma.digimon.update({
      where: { id: digimonId },
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

    return NextResponse.json({ 
      success: true, 
      data: updatedDigimon,
      message: 'Digimon actualizado exitosamente'
    })
  } catch (error) {
    console.error('Error updating Digimon:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al actualizar el Digimon' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const digimonId = parseInt(params.id)
    
    if (isNaN(digimonId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de Digimon inválido' 
        },
        { status: 400 }
      )
    }

    // Check if Digimon exists
    const existingDigimon = await prisma.digimon.findUnique({
      where: { id: digimonId }
    })

    if (!existingDigimon) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Digimon no encontrado' 
        },
        { status: 404 }
      )
    }

    await prisma.digimon.delete({
      where: { id: digimonId }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Digimon eliminado exitosamente' 
    })
  } catch (error) {
    console.error('Error deleting Digimon:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al eliminar el Digimon' 
      },
      { status: 500 }
    )
  }
}