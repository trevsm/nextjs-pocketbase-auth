import { pb } from "@/lib/pocketbase";
import moment from "moment";

export async function POST(request: Response) {
  const { reset_token } = await request.json();

  try {
    // Look through password_resets to find the token
    const passwordResets = await pb.collection("password_resets").getFullList({
      expand: "user",
    });
    const foundReset = passwordResets.find(
      (reset) => reset.token === reset_token
    );

    // If no reset found, return error
    if (!foundReset) {
      return Response.json({ error: "Invalid reset token" }, { status: 400 });
    }

    console.log(moment(foundReset.expires), moment());

    // If reset is expired, return error
    if (moment(foundReset.expires).isSameOrBefore(moment())) {
      return Response.json(
        { valid: false, error: "Reset token expired" },
        { status: 400 }
      );
    }

    return Response.json({ valid: true, message: "Reset token is valid" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Error checking reset token" },
      { status: 500 }
    );
  }
}
