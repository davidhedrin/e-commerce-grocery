import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs";
import { ExternalToast, toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
};

export async function hashPassword(password: string, salt: number = 10): Promise<string> {
  return await bcrypt.hash(password, salt);
};

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(password, hashed);
};

export function SonnerPromise(title: string = "Loading data...", desc?: string) {
  const dataToast: ExternalToast = {};
  if(desc) dataToast.description = desc;
  const toastId = toast.loading(title, dataToast);

  return toastId;
};

export function generateOtp(length: number): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}