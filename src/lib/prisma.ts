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

export async function createSession(token: string, expiresAt: Date, userId: number) {
  const session = await prisma.session.create({
    data: {
      token,
      expiresAt,
      userId
    },
    omit: {
      token: true
    }
  })
  return session
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email
    }
  })
  return user
}

export async function findSessionByToken(token: string) {
  const session = await prisma.session.findUniqueOrThrow({
    where: {
      token
    },
    include: {
      user: {
        omit: {
          password: true
        }
      }
    }
  })
  return session
}