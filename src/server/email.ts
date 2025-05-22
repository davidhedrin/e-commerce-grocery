"use server";

import { db } from "../../prisma/db";
import { Resend } from 'resend';
import ResetPasswordTemplate from '@/components/email/reset-password';
import { randomUUID } from "crypto";
import EmailVerifyTemplate from "@/components/email/email-verify";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const appName = process.env.NEXT_PUBLIC_APPS_NAME || "";

export async function ForgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  try {
    if(!resend) throw new Error("Resend api key not found!");

    const findEmail = await db.user.findUnique({
      where: {
        email: email,
        is_active: true
      }
    });
    if(!findEmail) throw new Error(`Sorry, but the email is not registration on ${appName}`);

    const token = findEmail.id + `${randomUUID()}${randomUUID()}`.replace(/-/g, '');
    await db.passwordResetToken.create({
      data: {
        userId: findEmail.id,
        token,
      }
    });
    
    const { data, error } = await resend.emails.send({
      from: `${appName} <no-replay@resend.dev>`,
      to: [email.toString()],
      subject: 'Password Reset',
      react: ResetPasswordTemplate({
        url: `${baseUrl}/auth/reset-password?token=${token}`
      }),
    });

    if (error) {
      console.log("😡Email1:", error);
      throw new Error(error.message);
    }

    console.log("😁Email:", {
      message: "Email password reset send successfuly.",
      ...data
    });
  } catch (error: any) {
    console.log("😡Email2:", error);
    throw new Error(error.message);
  }
}

export async function EmailVerification(formData: FormData) {
  // const email = formData.get("email") as string;
  const email = "portpolio.david99@gmail.com";
  try{
    if(!resend) throw new Error("Resend api key not found!");

    const findEmail = await db.user.findUnique({
      where: {
        email: email,
        is_active: true
      }
    });
    if(!findEmail) throw new Error(`Sorry, but the email is not registration on ${appName}`);

    const findExistToken = await db.verificationToken.findUnique({
      where: { userId: findEmail.id }
    });
    if(findExistToken && findExistToken.createAt != null && findExistToken.createAt >= new Date(Date.now() - 1000 * 60 * 1)) throw new Error("To many request, please wait a few menutes to request again!");
    
    const token = findEmail.id + `${randomUUID()}${randomUUID()}`.replace(/-/g, '');
    if (findExistToken) {
      await db.verificationToken.update({
        where: { userId: findEmail.id },
        data: {
          token,
          createAt: new Date()
        }
      });
    } else {
      await db.verificationToken.create({
        data: {
          userId: findEmail.id,
          token,
        }
      });
    }
    
    const { data, error } = await resend.emails.send({
      from: `${appName} <no-replay@resend.dev>`,
      to: [email.toString()],
      subject: 'Email Verification',
      react: EmailVerifyTemplate({
        url: `${baseUrl}/auth/reset-password?token=${token}`
      }),
    });

    if (error) {
      console.log("😡Email1:", error);
      throw new Error(error.message);
    }

    console.log("😁Email:", {
      message: "Email verification send successfuly.",
      ...data
    });
  } catch (error: any) {
    console.log("😡Email2:", error);
    throw new Error(error.message);
  }
}