import bcrypt from "bcrypt";
import { pb } from "@/lib/pocketbase";
import { ENV } from "@/env";
import { createToken, setRefreshToken } from "../../utils";
import { Tokens } from "@/constants";
import { toPublicUser, User } from "@/types";

export async function POST(request: Request) {
  let email, username, password;

  try {
    const body = await request.json();
    email = body.email;
    username = body.username;
    password = body.password;
  } catch (e) {
    return Response.json(
      {
        error: "Invalid JSON",
      },
      { status: 400 }
    );
  }

  if ((!email && !username) || !password) {
    return Response.json(
      {
        error: "Please provide an email or username and a password",
      },
      { status: 400 }
    );
  }

  const allUsers: User[] = await pb.collection("users").getFullList();
  const user = allUsers.find(
    (u) => u.email === email || u.username === username
  );

  if (!user) {
    return Response.json(
      {
        error: "User not found",
      },
      { status: 404 }
    );
  }

  try {
    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) {
      throw new Error("Invalid password");
    }
  } catch (e) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const accessToken = await createToken(
    user.id,
    Tokens.accessTokenExpiresIn,
    ENV.access_token_secret
  );

  const response = Response.json({
    user: toPublicUser(user),
    token: accessToken,
  });

  await setRefreshToken(response, user.id);

  return response;
}
