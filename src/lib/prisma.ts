import { PrismaClient } from "../../generated/prisma";
//--- tek bir prisma client oluşturur
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function registerUser(email: string, password: string) {
  const user = await prisma.user.create({
    data:{
      email,
      password,
    },
    omit:{
      password: true
    }
  })
  return user
}
