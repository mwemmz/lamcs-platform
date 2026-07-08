import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin users
  const adminHash = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@lamcs.coop" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@lamcs.coop",
      passwordHash: adminHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("  ✓ Admin user created (admin@lamcs.coop / admin123)");

  // Members
  const memberHash = await bcrypt.hash("member123", 12);
  const members = await Promise.all([
    prisma.member.upsert({
      where: { phone: "+260970000001" },
      update: {},
      create: {
        membershipNo: "LAMCS-001",
        name: "John Mulenga",
        phone: "+260970000001",
        email: "john@example.com",
        passwordHash: memberHash,
        farmLocation: "Chongwe District",
        status: "ACTIVE",
      },
    }),
    prisma.member.upsert({
      where: { phone: "+260970000002" },
      update: {},
      create: {
        membershipNo: "LAMCS-002",
        name: "Mary Banda",
        phone: "+260970000002",
        email: "mary@example.com",
        passwordHash: memberHash,
        farmLocation: "Kafue District",
        status: "ACTIVE",
      },
    }),
    prisma.member.upsert({
      where: { phone: "+260970000003" },
      update: {},
      create: {
        membershipNo: "LAMCS-003",
        name: "Peter Zulu",
        phone: "+260970000003",
        passwordHash: memberHash,
        farmLocation: "Lusaka",
        status: "INACTIVE",
      },
    }),
  ]);
  console.log("  ✓ 3 members created (use any phone + password: member123)");

  // Produce listings
  const listings = await Promise.all([
    prisma.produceListing.upsert({
      where: { id: "seed-grade-a" },
      update: {},
      create: {
        id: "seed-grade-a",
        name: "Grade A Avocados",
        category: "fresh",
        grade: "A",
        price: 45.0,
        quantityKg: 2000,
        images: "[]",
        status: "ACTIVE",
      },
    }),
    prisma.produceListing.upsert({
      where: { id: "seed-grade-b" },
      update: {},
      create: {
        id: "seed-grade-b",
        name: "Grade B Avocados",
        category: "fresh",
        grade: "B",
        price: 30.0,
        quantityKg: 1500,
        images: "[]",
        status: "ACTIVE",
      },
    }),
    prisma.produceListing.upsert({
      where: { id: "seed-avocado-oil" },
      update: {},
      create: {
        id: "seed-avocado-oil",
        name: "Avocado Oil",
        category: "processed",
        grade: "A",
        price: 120.0,
        quantityKg: 0,
        images: "[]",
        status: "OUT_OF_STOCK",
      },
    }),
  ]);
  console.log("  ✓ 3 produce listings created");

  // Content pages
  await Promise.all([
    prisma.contentPage.upsert({
      where: { slug: "about" },
      update: {},
      create: {
        slug: "about",
        title: "About LAMCS",
        body: "Lusaka Avocado Multipurpose Cooperative Society Limited (LAMCS) is a farmer-owned cooperative based in Lusaka Province, Zambia.",
        published: true,
      },
    }),
    prisma.contentPage.upsert({
      where: { slug: "home" },
      update: {},
      create: {
        slug: "home",
        title: "Home Page",
        body: "Welcome to LAMCS — Growing Zambia's Finest Avocados, Together.",
        published: true,
      },
    }),
  ]);
  console.log("  ✓ Content pages created");

  // Sample order
  const order = await prisma.order.upsert({
    where: { reference: "DEMO-001" },
    update: {},
    create: {
      reference: "DEMO-001",
      buyerName: "Demo Buyer",
      buyerPhone: "+260970000000",
      totalAmount: 225.0,
      status: "PENDING",
      items: {
        create: [
          { listingId: "seed-grade-a", quantityKg: 5, unitPrice: 45.0 },
        ],
      },
    },
  });
  console.log("  ✓ Demo order created");

  // Sample contribution records
  const members_db = await prisma.member.findMany({ take: 2 });
  if (members_db[0]) {
    await prisma.contribution.createMany({
      data: [
        { memberId: members_db[0].id, produceType: "Avocados", grade: "A", quantityKg: 500, deliveredAt: new Date("2026-06-15"), recordedBy: "seed" },
        { memberId: members_db[0].id, produceType: "Avocados", grade: "B", quantityKg: 350, deliveredAt: new Date("2026-06-01"), recordedBy: "seed" },
      ],
    });
  }
  if (members_db[1]) {
    await prisma.contribution.createMany({
      data: [
        { memberId: members_db[1].id, produceType: "Avocados", grade: "A", quantityKg: 400, deliveredAt: new Date("2026-06-10"), recordedBy: "seed" },
      ],
    });
  }
  console.log("  ✓ Sample contributions created");

  // Sample payouts
  if (members_db[0]) {
    await prisma.payout.createMany({
      data: [
        { memberId: members_db[0].id, amount: 2250, status: "PAID", paidAt: new Date("2026-06-30") },
        { memberId: members_db[0].id, amount: 1200, status: "PAID", paidAt: new Date("2026-06-15") },
        { memberId: members_db[0].id, amount: 1800, status: "PENDING" },
      ],
    });
  }
  console.log("  ✓ Sample payouts created");

  console.log("\nSeed complete!");
  console.log("  Admin:  admin@lamcs.coop / admin123");
  console.log("  Member: +260970000001 / member123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
