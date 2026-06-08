const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando la siembra de datos de Instrumentos Musicales...');

  // Limpiar tablas existentes en orden inverso de dependencias
  await prisma.item.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});

  // 1. Crear Roles
  const adminRole = await prisma.role.create({
    data: { name: 'ADMIN' },
  });

  const userRole = await prisma.role.create({
    data: { name: 'USER' },
  });

  console.log('Roles creados con éxito.');

  // 2. Crear Usuarios con contraseñas encriptadas
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const hashedPasswordUser = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@harmony.com',
      password: hashedPasswordAdmin,
      roleId: adminRole.id,
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      email: 'user@harmony.com',
      password: hashedPasswordUser,
      roleId: userRole.id,
    },
  });

  console.log('Usuarios de prueba creados:', {
    admin: adminUser.email,
    user: normalUser.email,
  });

  // 3. Crear Categorías de Instrumentos
  const stringsCategory = await prisma.category.create({
    data: { name: 'Cuerdas' },
  });

  const keyboardsCategory = await prisma.category.create({
    data: { name: 'Teclados' },
  });

  const percussionCategory = await prisma.category.create({
    data: { name: 'Percusión' },
  });

  console.log('Categorías creadas.');

  // 4. Crear Instrumentos Musicales Iniciales
  const items = [
    {
      title: 'Guitarra Gibson Les Paul Standard',
      description: 'La leyenda de las guitarras eléctricas. Cuerpo de caoba con tapa de arce, dos pastillas humbucker Burstbucker y un tono clásico inigualable ideal para rock y blues.',
      price: 2499.0,
      imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&q=80&w=400',
      categoryId: stringsCategory.id,
    },
    {
      title: 'Piano Digital Yamaha P-125',
      description: 'Piano digital compacto con teclado GHS de 88 teclas contrapesadas. Ofrece el sonido del famoso piano de cola de concierto Yamaha CFIIIS con una fidelidad acústica excepcional.',
      price: 699.0,
      imageUrl: 'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=400',
      categoryId: keyboardsCategory.id,
    },
    {
      title: 'Batería Acústica Pearl Export EXX',
      description: 'La batería más vendida de todos los tiempos. Vasos de álamo y caoba asiática para un sonido potente, herrajes de la serie 830 y platos Sabian SBR incluidos.',
      price: 899.0,
      imageUrl: 'https://images.unsplash.com/photo-1547427650-85cd4931a26d?auto=format&fit=crop&q=80&w=400',
      categoryId: percussionCategory.id,
    },
    {
      title: 'Ukelele Concierto Fender Venice',
      description: 'Inspirado en el espíritu libre de Venice, California. Cuerpo de tilo americano compacto, pala Telecaster clásica y mástil cómodo con acabado satinado.',
      price: 79.0,
      imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=400',
      categoryId: stringsCategory.id,
    },
    {
      title: 'Sintetizador Analógico Korg Minilogue',
      description: 'Sintetizador analógico polifónico de 4 voces de nueva generación. Mapeado de panel intuitivo con 200 presets, secuenciador de 16 pasos y osciloscopio integrado.',
      price: 549.0,
      imageUrl: 'https://images.unsplash.com/photo-1612450798939-9d78473950fb?auto=format&fit=crop&q=80&w=400',
      categoryId: keyboardsCategory.id,
    },
    {
      title: 'Cajón Flamenco Meinl Headliner',
      description: 'Cajón de percusión acústica construido en abedul báltico. Cuenta con cuerdas internas ajustables para un efecto de caja nítido y graves profundos e intensos.',
      price: 119.0,
      imageUrl: 'https://images.unsplash.com/photo-1595062584113-e28440072007?auto=format&fit=crop&q=80&w=400',
      categoryId: percussionCategory.id,
    }
  ];

  for (const item of items) {
    await prisma.item.create({ data: item });
  }

  console.log('Instrumentos musicales creados con éxito en la base de datos.');
}

main()
  .catch((e) => {
    console.error('Error durante la siembra de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
