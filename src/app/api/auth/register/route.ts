import { messages } from "@/lib/messages";
import { registerUser } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { Prisma } from "../../../../../generated/prisma";
import bcrypt from "bcrypt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = registerSchema.parse(body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const registeredUser = await registerUser(email, hashedPassword);

    return NextResponse.json({ registeredUser }, { status: 201 });
  } catch (error) {
    //console.log(`HATA OLUSTU: ${error}`);
    if (error instanceof z.ZodError) {
      const firstError = z.flattenError(error);
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code == "P2002"
    ) {
      return NextResponse.json(
        { error: messages.emailAlreadyTaken },
        { status: 401 }
      );
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}
