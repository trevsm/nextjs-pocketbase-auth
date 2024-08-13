import { createToken, setRefreshToken } from "@/app/api/utils";
import { ENV } from "@/env";
import { Tokens } from "@/constants";
import { toPublicUser, User } from "@/types";
import { pb } from "@/lib/pocketbase";
import bcrypt from "bcrypt";
import moment from "moment";

export async function POST(request: Response) {
  const { name, email, password, code } = await request.json();

  try {
    const parsedCode = parseInt(code);

    // Check if a user with this email already exists
    const users = await pb.collection("users").getFullList();
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      return Response.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const codes = await pb.collection("verification_codes").getFullList();
    const myCodes = codes.filter(
      (verification) => verification.email === email
    );

    const existingCode = myCodes.find(
      (verification) => verification.code === parsedCode
    );

    if (!existingCode) {
      return Response.json({ error: "Invalid verification" }, { status: 400 });
    }

    if (moment(existingCode.expires).isBefore(moment())) {
      return Response.json(
        { error: "Verification code expired" },
        { status: 400 }
      );
    }

    // Create new user
    const newUser: User = await pb.collection("users").create({
      name,
      email,
      hashed_password: await bcrypt.hash(password, 10),
    });

    // delete all verification codes for this email
    await Promise.all(
      myCodes.map((code) => pb.collection("verification_codes").delete(code.id))
    );

    const accessToken = await createToken(
      newUser.id,
      Tokens.accessTokenExpiresIn,
      ENV.access_token_secret
    );

    const response = Response.json({
      user: toPublicUser(newUser),
      token: accessToken,
    });

    await setRefreshToken(response, newUser.id);

    return response;
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error creating user" }, { status: 500 });
  }
}
