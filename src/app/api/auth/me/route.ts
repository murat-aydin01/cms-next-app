import { messages } from "@/lib/messages";
import { findSessionByToken } from "@/lib/prisma";
import { checkIfExpired } from "@/utils/dateUtils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "../../../../../generated/prisma";

export async function GET() {
  const responseInvalid = NextResponse.json(
    { error: messages.sessionNotFound },
    { status: 401 }
  );
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) return responseInvalid;

    const userBySession = await findSessionByToken(session);
    const expired = checkIfExpired(userBySession.expiresAt);

    if (expired) return responseInvalid;

    return NextResponse.json(userBySession.user);
  } catch (error) {
    console.log(error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    )
      return responseInvalid;
    return NextResponse.json({ error: messages.unknownError }, { status: 500 });
  }
}
