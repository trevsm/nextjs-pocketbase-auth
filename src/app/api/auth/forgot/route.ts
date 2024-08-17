import { NextRequest } from "next/server";
import { pb } from "@/lib/pocketbase";
import nodemailer from "nodemailer";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { ENV } from "@/env";
import { Routes } from "@/constants";

export async function POST(request: NextRequest) {
  let email;

  try {
    const body = await request.json();
    email = body.email;
  } catch (error) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    // First, check if a user with this email even exists
    const users = await pb.collection("users").getFullList();
    const foundUser = users.find((user) => user.email === email);

    if (!foundUser) {
      return Response.json(
        { error: "User with this email does not exist" },
        { status: 400 }
      );
    }

    const token = uuid();

    await pb.collection("password_resets").create({
      token,
      user: foundUser.id,
      expire: moment().add(5, "minutes").toDate(),
    });

    const transport = nodemailer.createTransport({
      host: ENV.smtp_host,
      port: ENV.smtp_port,
      secure: false,
      auth: {
        user: ENV.smtp_user,
        pass: ENV.smtp_pass,
      },
    });

    const mailOptions = {
      from: "Example Company <test@gmail.com>",
      to: email,
      subject: "Reset Password",
      text: "Click the link to reset your password",
      html: /*html*/ `
        <h1>Reset Password</h1>
        <p>Click the link to reset your password</p>
        <a href="${ENV.base_url}${Routes.forgotPassword}?reset_token=${token}&email=${foundUser.email}">Reset Password</a>
      `,
    };

    await transport.sendMail(mailOptions);

    return Response.json({ message: "Reset link sent. Check your email." });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error sending email" }, { status: 500 });
  }
}
