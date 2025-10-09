import { auth } from "@/server/auth/auth";
import { createCode, getCode } from "@/server/auth/unityHelpers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();

  const sessionToken = (
    request.cookies.get("__Secure-authjs.session-token") ??
    request.cookies.get("authjs.session-token")
  )?.value;

  if (!session || !sessionToken)
    return NextResponse.json(
      {
        error: "internal_error",
        error_description: "Could not get session",
      },
      { status: 500 }
    );

  const preCode = await getCode(request.nextUrl.searchParams.get("code") ?? "");

  if (!preCode) return NextResponse.json({}, { status: 400 });

  const code = await createCode({
    client_id: preCode.client_id,
    code_challenge: preCode.code_challenge,
    redirect_uri: preCode.redirect_uri,
    scope: preCode.scope,
    sessionToken: sessionToken,
    userId: session.user.id,
  });

  return redirect(
    new URL(
      `?code=${code}&state=${request.nextUrl.searchParams.get("state")}`,
      preCode.redirect_uri
    ).toString()
  );
}
