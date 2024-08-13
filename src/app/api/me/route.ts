import { toPublicUser, User } from "@/types";
import { pb } from "@/lib/pocketbase";
import { getAuth } from "../utils";

export async function GET(request: Request) {
  const userId = await getAuth(request);

  if (!userId) {
    return Response.json({ error: "Access Denied" }, { status: 401 });
  }
  let user: User;

  try {
    user = await pb.collection("users").getOne(userId);
  } catch (e) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json({ user: toPublicUser(user) });
}
