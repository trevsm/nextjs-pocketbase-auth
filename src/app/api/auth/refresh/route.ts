import jwt from "jsonwebtoken";
import { pb } from "@/lib/pocketbase";
import { ENV } from "@/env";
import { createToken, setRefreshToken } from "../../utils";
import { Tokens } from "@/constants";
import { cookies } from "next/headers";
import { AuthPayload } from "@/types";

export async function POST() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return new Response(JSON.stringify({ error: "Access Denied" }), {
      status: 403,
    });
  }

  let payload: AuthPayload;
  try {
    payload = jwt.verify(refreshToken, ENV.refresh_token_secret) as AuthPayload;
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid Refresh Token" }), {
      status: 403,
    });
  }

  // Check if token is blacklisted
  const blacklistedTokens = await pb
    .collection("token_blacklists")
    .getFullList();
  const token = blacklistedTokens.find((t) => t.token === refreshToken);

  if (token) {
    return new Response(
      JSON.stringify({ error: "Token Blacklisted. Please login again." }),
      {
        status: 403,
      }
    );
  }

  const sessions = await pb.collection("sessions").getFullList();
  const session = sessions.find((s) => s.token === refreshToken);

  if (!session) {
    await pb.collection("token_blacklists").create({
      user: payload.user_id,
      token: refreshToken,
    });

    // Delete all sessions for that user if token is blacklisted
    let sessions = await pb.collection("sessions").getFullList();
    sessions = sessions.filter((s) => s.user === payload.user_id);

    for (const session of sessions) {
      await pb.collection("sessions").delete(session.id);
    }

    return new Response(
      JSON.stringify({ error: "Invalid Token. Please login again." }),
      {
        status: 403,
      }
    );
  }

  // Delete the old session from the database
  await pb.collection("sessions").delete(session.id);

  const accessToken = await createToken(
    payload.user_id,
    Tokens.accessTokenExpiresIn,
    ENV.access_token_secret
  );

  const response = Response.json({
    accessToken,
  });

  await setRefreshToken(response, payload.user_id);

  return response;
}
