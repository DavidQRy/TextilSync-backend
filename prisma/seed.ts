import { prisma } from "#config/prisma";

async function main() {
  const roles = [
    { id: 1, name: "ADMIN" },
    { id: 2, name: "OPERATOR" },
    { id: 3, name: "SUPERVISOR" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: role,
    });
  }

  console.log("✅ Roles seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding roles:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
