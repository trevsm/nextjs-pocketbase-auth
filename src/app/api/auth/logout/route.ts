import { pb } from "@/lib/pocketbase";
import { cookies } from "next/headers";

// logout, remove session from database and clear cookies
export async function POST() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json(
      { error: "No refresh token" },
      {
        status: 400,
      }
    );
  }

  const allSessions = await pb.collection("sessions").getFullList();
  const session = allSessions.find((s) => s.token === refreshToken);

  if (!session) {
    return Response.json(
      { error: "Invalid refresh token" },
      {
        status: 400,
      }
    );
  }

  await pb.collection("sessions").delete(session.id);

  return Response.json(
    { message: "Logged out" },
    {
      headers: {
        "Set-Cookie":
          "refreshToken=; Max-Age=0; Path=/; HttpOnly; SameSite=strict",
      },
    }
  );
}
