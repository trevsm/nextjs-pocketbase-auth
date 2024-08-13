// app/api/send-verification-code/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pb } from "@/lib/pocketbase";
import nodemailer from "nodemailer";
import moment from "moment";
import { ENV } from "@/env";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  try {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // First, check if a user with this email already exists
    const users = await pb.collection("users").getFullList();
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      return Response.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // code, email, expires, verified
    await pb.collection("verification_codes").create({
      code: verificationCode,
      email,
      expires: moment().add(5, "minutes").toDate(),
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
      subject: "Verification Code",
      text: `Your verification code is ${verificationCode}`,
      html: /*html*/ `
        <h1>Your Verification Code</h1>
        <p>Your verification code is <strong>${verificationCode}</strong></p>
      `,
    };

    await transport.sendMail(mailOptions);

    // Store verification code in the database or session for later verification
    // For demonstration purposes, we'll log it
    console.log(`Verification code for ${email}: ${verificationCode}`);

    return NextResponse.json({ message: "Verification email sent" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}
