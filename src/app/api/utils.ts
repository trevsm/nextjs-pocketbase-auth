import jwt from "jsonwebtoken";
import { ENV } from "@/env";
import { Tokens } from "@/constants";
import { serialize } from "cookie";
import { pb } from "@/lib/pocketbase";
import { cookies } from "next/headers";

export const refreshTokenData = {
  httpOnly: true,
  secure: ENV.node_env !== "development",
  maxAge: Tokens.refreshTokenExpiresIn,
  sameSite: "strict",
  path: "/",
} as { [key: string]: any };

export const createToken = async (
  user_id: string,
  exp: number,
  secret: string
) => {
  const now = Math.floor(Date.now() / 1000);

  const tokenPayload = {
    iat: now,
    exp: now + exp,
    user_id,
  };

  const token = jwt.sign(tokenPayload, secret);

  return token;
};

export async function setRefreshToken(response: Response, user_id: string) {
  const refreshToken = await createToken(
    user_id,
    Tokens.refreshTokenExpiresIn,
    ENV.refresh_token_secret
  );

  await pb.collection("sessions").create({
    user: user_id,
    token: refreshToken,
  });

  const cookie = serialize(
    Tokens.refreshTokenId,
    refreshToken,
    refreshTokenData
  );

  response.headers.set("Set-Cookie", cookie);
}

export async function getAuth(request: Request): Promise<string | null> {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return null;
  }

  try {
    jwt.verify(token, ENV.access_token_secret);
  } catch (err) {
    return null;
  }

  const payload = jwt.decode(token) as { user_id: string };
  return payload.user_id;
}
