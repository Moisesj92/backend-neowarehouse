import { prisma } from "../src/lib/prisma";

async function main() {
  const categoriesData = [
    { name: "Electrónicos" },
    { name: "Ropa" },
    { name: "Hogar" },
    { name: "Deportes" },
    { name: "Juguetes" },
  ];

  const categories = await Promise.all(
    categoriesData.map((category) =>
      prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      })
    )
  );

  const productsData = [
    { name: "Laptop", price: 750000, stock: 0, categoryId: categories[0].id },
    { name: "Camiseta", price: 5000, stock: 0, categoryId: categories[1].id },
    { name: "Lámpara", price: 45000, stock: 0, categoryId: categories[2].id },
    { name: "Balón", price: 3000, stock: 0, categoryId: categories[3].id },
    { name: "Muñeca", price: 7500, stock: 0, categoryId: categories[4].id },
  ];

  for (const product of productsData) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }

  console.log("✅ Seed completado");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
