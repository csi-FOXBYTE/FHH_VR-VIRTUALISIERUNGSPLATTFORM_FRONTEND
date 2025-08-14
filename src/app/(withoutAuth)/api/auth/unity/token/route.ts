import {
  createAccessToken,
  createRefreshToken,
  getCode,
} from "@/server/auth/unityHelpers";
import { NextRequest, NextResponse } from "next/server";
import { verifyChallenge } from "pkce-challenge";

export async function POST(request: NextRequest) {
  try {
    const form = Object.fromEntries(await request.formData()) as Record<
      string,
      string
    >;
    const { grant_type, code, code_verifier, redirect_uri } = form;

    if (grant_type !== "authorization_code" || !code || !code_verifier) {
      return NextResponse.json(
        {
          error: "invalid_request",
          error_description: "Missing or invalid parameters",
        },
        { status: 400 }
      );
    }

    const payload = await getCode(code);

    if (!payload)
      return NextResponse.json(
        {
          error: "invalid_grant",
          error_description:
            "Authorization code invalid, expired, or bad algorithm",
        },
        { status: 400 }
      );

    if (payload.redirect_uri !== redirect_uri) {
      return NextResponse.json(
        {
          error: "invalid_grant",
          error_description: "Mismatched redirect_uri or client_id",
        },
        { status: 400 }
      );
    }

    const isValid = await verifyChallenge(
      code_verifier,
      payload.code_challenge
    );

    if (!isValid)
      return NextResponse.json(
        {
          error: "invalid_grant",
          error_description: "Code challenge did not pass",
        },
        { status: 400 }
      );

    const access_token = await createAccessToken({
      sessionToken: payload.sessionToken,
      userId: payload.userId,
    });

    const refresh_token = await createRefreshToken({
      client_id: payload.client_id,
      scope: payload.scope,
      sessionToken: payload.sessionToken,
      userId: payload.userId,
    });

    return NextResponse.json({
      access_token,
      refresh_token,
      token_type: "Bearer",
      expires_in: 3600,
      scope: payload.scope,
    });
  } catch (e) {
    console.error(JSON.stringify(e), { e });
    throw e;
  }
}
