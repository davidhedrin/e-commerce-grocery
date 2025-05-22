"use server";

import { db } from "../../prisma/db";
import { hashPassword } from "@/lib/utils";
import { signIn, signOut } from "@/lib/auth-setup"
import { AuthProviderEnum, RolesEnum } from "@prisma/client";
import { EmailVerification } from "./email";
import { randomUUID } from "crypto";

export async function getUserById(id:number) {
  const findData = await db.user.findUnique({ where: { id } });
  return findData;
}

export async function signInGoogle() {
  await signIn("google");
};

export async function signOutAuth() {
  await signOut({redirectTo: "/auth"});
};

export async function signInCredential(formData: FormData) {
  const data = Object.fromEntries(formData);
  const dataSign = {
    redirect: false,
    email: data.email,
    password: data.password,
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
      
      const token = user.id + `${randomUUID()}${randomUUID()}`.replace(/-/g, '');
      await tx.verificationToken.create({
        data: {
          userId: user.id,
          token,
        }
      });

      await EmailVerification(user.email, token);
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function resetPassword(formData: FormData) {
  try {
    const password = formData.get("password") as string;
    const tokens = formData.get("token") as string;
    if(tokens === undefined || tokens.toString().trim() === "") throw new Error("Looks like your token is missing. Click and try again!");

    const findToken = await db.passwordResetToken.findUnique({
      where: {
        token: tokens,
        createAt: { gt: new Date(Date.now() - 1000 * 60 * 5)},
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

export async function EmailVerify() {
  
}