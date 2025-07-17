import { getAccessToken } from "@/server/auth/unityHelpers";
import prisma from "@/server/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return new NextResponse(null, { status: 401, statusText: "ACCESS_DENIED" });
  }
  const accessToken = auth.slice("Bearer ".length);

  const decrypted = await getAccessToken(accessToken);

  if (!decrypted)
    return new NextResponse(null, { status: 401, statusText: "ACCESS_DENIED" });

  const adapter = PrismaAdapter(prisma);

  await adapter.deleteSession?.(decrypted.sessionToken);

  return new NextResponse(null, { status: 204, statusText: "SIGNED_OUT" });
}
