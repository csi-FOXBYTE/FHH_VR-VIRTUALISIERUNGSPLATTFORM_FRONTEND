import { EncryptJWT, jwtDecrypt } from "jose";

const accessTokenMaxAge = "60 minutes";
const refreshTokenMaxAge = "1 year";
const audience = "urn:fhhvr";
const codeTokenMaxAge = "5 minutes";

export async function getAccessToken(access_token: string) {
  try {
    const { payload } = await jwtDecrypt<{
      userId: string;
      sessionToken: string;
    }>(access_token, Buffer.from(process.env.NEXTAUTH_SECRET!, "base64"), {
      audience,
      maxTokenAge: accessTokenMaxAge,
    });
    return payload;
  } catch {
    return null;
  }
}

export async function createAccessToken(payload: {
  sessionToken: string;
  userId: string;
}) {
  return await new EncryptJWT({
    sessionToken: payload.sessionToken,
    userId: payload.userId,
  })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setAudience(audience)
    .setExpirationTime(accessTokenMaxAge)
    .setIssuedAt(new Date())
    .setNotBefore(new Date())
    .encrypt(Buffer.from(process.env.NEXTAUTH_SECRET!, "base64"));
}

export async function getRefreshToken(refresh_token: string) {
  try {
    const { payload } = await jwtDecrypt<{
      userId: string;
      scope: string;
      client_id: string;
      sessionToken: string;
    }>(refresh_token, Buffer.from(process.env.NEXTAUTH_SECRET!, "base64"), {
      audience,
      maxTokenAge: refreshTokenMaxAge,
    });
    return payload;
  } catch {
    return null;
  }
}

export async function createRefreshToken(payload: {
  userId: string;
  scope: string;
  client_id: string;
  sessionToken: string;
}) {
  return await new EncryptJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setAudience(audience)
    .setExpirationTime(refreshTokenMaxAge)
    .setIssuedAt(new Date())
    .setNotBefore(new Date())
    .encrypt(Buffer.from(process.env.NEXTAUTH_SECRET!, "base64"));
}

export async function getCode(code: string) {
  try {
    const { payload } = await jwtDecrypt<{
      code_challenge: string;
      scope: string;
      redirect_uri: string;
      client_id: string;
      sessionToken: string;
      userId: string;
    }>(code, Buffer.from(process.env.NEXTAUTH_SECRET!, "base64"), {
      audience,
      maxTokenAge: refreshTokenMaxAge,
    });

    return payload;
  } catch {
    return null;
  }
}

export function createCode({
  client_id,
  code_challenge,
  redirect_uri,
  scope,
  sessionToken,
  userId,
}: {
  code_challenge: string;
  scope: string;
  redirect_uri: string;
  client_id: string;
  sessionToken: string;
  userId: string;
}) {
  return new EncryptJWT({
    code_challenge,
    scope,
    redirect_uri,
    client_id,
    sessionToken,
    userId,
  })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setAudience("urn:fhhvr")
    .setExpirationTime(codeTokenMaxAge)
    .setNotBefore(new Date())
    .setIssuedAt(new Date())
    .encrypt(Buffer.from(process.env.NEXTAUTH_SECRET!, "base64"));
}
