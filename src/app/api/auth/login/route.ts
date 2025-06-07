import { createSession, findUserByEmail } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { messages } from "@/lib/messages";
import { z } from "zod/v4";
import { Prisma } from "../../../../../generated/prisma";
import { createExpiresAt } from "@/utils/dateUtils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);
    const user = await findUserByEmail(email);
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new Error(messages.invalidCredentials); //TODO error class'ı oluştur.
    const token = crypto.randomUUID();
    const expiresAt = createExpiresAt()
    const session = await createSession(token, expiresAt, user.id);
    const response = NextResponse.json(session);
    response.cookies.set("session", token, {
      httpOnly: true,
      expires: expiresAt,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
       console.log(z.flattenError(error));
      return NextResponse.json({ error: messages.incorrectCredentials }, { status: 400 });
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code == 'P2025'
    ) {
      return NextResponse.json(
        { error: messages.invalidCredentials },
        { status: 401 }
      );
    }
    return NextResponse.json({error: error instanceof Error ? error.message : messages.unknownError}, { status: 500 });
  }
}
