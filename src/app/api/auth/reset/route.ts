import { pb } from "@/lib/pocketbase";
import bcrypt from "bcrypt";
import moment from "moment";

export async function POST(request: Response) {
  const { new_password, reset_token } = await request.json();

  try {
    // first look through password_resets to find the token
    const passwordResets = await pb.collection("password_resets").getFullList({
      expand: "user",
    });
    const foundReset = passwordResets.find(
      (reset) => reset.token === reset_token
    );

    // if no reset found, return error
    if (!foundReset) {
      return Response.json({ error: "Invalid reset token" }, { status: 400 });
    }

    // If reset is expired, return error
    if (moment(foundReset.expires).isSameOrBefore(moment())) {
      return Response.json(
        { valid: false, error: "Reset token expired" },
        { status: 400 }
      );
    }
    // update user's password
    await pb.collection("users").update(foundReset.user, {
      hashed_password: await bcrypt.hash(new_password, 10),
    });

    // delete old reset
    await pb.collection("password_resets").delete(foundReset.id);

    return Response.json({ message: "Password updated" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Error resetting password" },
      { status: 500 }
    );
  }
}
