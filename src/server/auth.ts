"use server";

import { db } from "../../prisma/db";
import { generateOtp, hashPassword } from "@/lib/utils";
import { signIn, signOut } from "@/lib/auth-setup";
import { AuthProviderEnum, RolesEnum } from "@prisma/client";
import { EmailVerification } from "./email";
import { randomUUID } from "crypto";
import Configs from "@/lib/config";

export async function getUserById(id:number) {
  const findData = await db.user.findUnique({ where: { id } });
  return findData;
};

export async function signInGoogle() {
  await signIn("google");
};

export async function signOutAuth() {
  await signOut({redirectTo: "/auth"});
};

export async function signInCredential(formData: FormData) {
  const data = Object.fromEntries(formData);
  const email = data.email as string;
  const password = data.password as string;
  const dataSign = {
    redirect: false,
    email,
    password,
  };
  
  try {
    await signIn('credentials', dataSign);
  } catch (err: any) {
    if (err.type === "AuthError") throw err;
    throw new Error("Unexpected error during sign-in.");
  }
};

export async function signUpAction(formData: FormData) {
  try {
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const hashPass = await hashPassword(password, 15);
  
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullname,
          email,
          password: hashPass,
          is_active: true,
          createdBy: email,
          provider: AuthProviderEnum.CREDENTIAL,
          role: RolesEnum.USER
        }
      });
      
      const otpCode = generateOtp(6);
      const token = user.id + `${randomUUID()}${randomUUID()}`.replace(/-/g, '');
      await tx.verificationToken.create({
        data: {
          userId: user.id,
          token,
          otp: otpCode
        }
      });

      await EmailVerification(user.email, token, otpCode);
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function checkTokenResetPass(token: string) {
  try {
    const findData = await db.passwordResetToken.findUnique({
      where: { 
        token,
        createAt: { gt: new Date(Date.now() - 1000 * 60 * Configs.valid_reset_pass)},
        usingAt: null
      }
    });

    if(!findData) throw new Error("Looks like something wrong with your url. The token may be incorrect or no longer valid.");
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function checkTokenEmail(token: string) {
  try {
    const findData = await db.verificationToken.findUnique({
      where: { 
        token,
        createAt: { gt: new Date(Date.now() - 1000 * 60 * Configs.valid_email_verify)},
        usingAt: null
      }
    });

    if(!findData) throw new Error("Looks like something wrong with your url. The token may be incorrect or no longer valid.");
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function resetPassword(formData: FormData) {
  try {
    const password = formData.get("password") as string;
    const tokens = formData.get("token") as string;
    if(tokens === undefined || tokens.toString().trim() === "") throw new Error("Looks like something wrong with your url. Click the link and try again!");

    const findToken = await db.passwordResetToken.findUnique({
      where: {
        token: tokens,
        createAt: { gt: new Date(Date.now() - 1000 * 60 * Configs.valid_reset_pass)},
        usingAt: null
      }
    });
    if(!findToken) throw new Error("We couldn't verify. The token may be incorrect or no longer valid.");

    const hashPass = await hashPassword(password, 15);
    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: findToken.userId
        },
        data: {
          password: hashPass
        }
      });
  
      await tx.passwordResetToken.update({
        where: {
          id: findToken.id
        },
        data: {
          usingAt: new Date()
        }
      });
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function emailVerify(formData: FormData) {
  try {
    const tokens = formData.get("token") as string;
    const otp_code = formData.get("otp_code") as string;
    if(tokens === undefined || tokens.toString().trim() === "") throw new Error("Looks like something wrong with your url. Click the link and try again!");
    if(otp_code === undefined || otp_code.toString().trim() === "" || otp_code.toString().trim().length != 6) throw new Error("Invalid one-time-password (OTP). Try again or generate new OTP!");

    const findToken = await db.verificationToken.findUnique({
      where: {
        token: tokens,
        otp: otp_code,
        createAt: { gt: new Date(Date.now() - 1000 * 60 * Configs.valid_email_verify)},
        usingAt: null
      }
    });
    if(!findToken) throw new Error("We couldn't verify. The token or OTP may be incorrect or no longer valid.");

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: findToken.userId
        },
        data: {
          email_verified: new Date()
        }
      });

      await tx.verificationToken.update({
        where: { token: tokens, userId: findToken.userId },
        data: { usingAt: new Date() }
      });
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};