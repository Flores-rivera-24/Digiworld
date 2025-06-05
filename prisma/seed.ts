import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  // Limpiar datos existentes
  await prisma.digimon.deleteMany({})
  
  // Crear Digimons de ejemplo
  const sampleDigimons = [
    {
      name: "Agumon",
      level: "Rookie",
      type: "Vaccine",
      description: "A small dinosaur Digimon with great potential. It has a brave heart and never gives up.",
      attackPower: 120,
      defenseValue: 90
    },
    {
      name: "Gabumon",
      level: "Rookie", 
      type: "Data",
      description: "A shy but loyal wolf-like Digimon. It wears the pelt of another Digimon.",
      attackPower: 110,
      defenseValue: 100
    },
    {
      name: "Greymon",
      level: "Champion",
      type: "Vaccine", 
      description: "The evolved form of Agumon. A powerful dinosaur Digimon with great strength.",
      attackPower: 180,
      defenseValue: 140
    },
    {
      name: "Patamon",
      level: "Rookie",
      type: "Data",
      description: "A small, cute mammal Digimon with wings. Despite its appearance, it's quite powerful.",
      attackPower: 95,
      defenseValue: 85
    },
    {
      name: "Devimon",
      level: "Champion",
      type: "Virus",
      description: "A fallen angel Digimon with dark powers. It spreads evil wherever it goes.",
      attackPower: 170,
      defenseValue: 120
    },
    {
      name: "Tentomon",
      level: "Rookie",
      type: "Vaccine",
      description: "An insect Digimon with high intelligence and curiosity about everything.",
      attackPower: 105,
      defenseValue: 95
    }
  ]

  for (const digimon of sampleDigimons) {
    const created = await prisma.digimon.create({
      data: digimon
    })
    console.log(`✅ Created: ${created.name}`)
  }

  console.log('🎉 Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })