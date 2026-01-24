import 'dotenv/config'
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient  } from "#generated/prisma/client";

import { afterAll, beforeAll } from "vitest";



const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({ connectionString });
 
const prisma = new PrismaClient({adapter})

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
import { describe, it, expect } from "vitest";


describe("Prisma connection", () => {
  it("should connect and run a raw query", async () => {
    const result = await prisma.$queryRaw<
      { now: Date }[]
    >`SELECT NOW() as now`;

    expect(result.length).toBe(1);
    expect(result[0].now).toBeInstanceOf(Date);
  });
});
