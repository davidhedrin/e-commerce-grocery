import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs";
import { ExternalToast, toast } from "sonner";
import { TableShortList, TableThModel } from "./models-type";
import { PictureTypeEnum } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
};

export const pictureTypeLabels: Record<PictureTypeEnum, string> = {
  FILE: 'Upload File',
  URL: 'URL',
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

export function sortListToOrderBy(sortList: TableShortList[]): Record<string, any>[] {
  return sortList
  .filter(col => col.sort?.trim())
  .map(col => {
    const keys = col.key.split(".");
    return keys.reduceRight((acc, key, i) => ({ [key]: i === keys.length - 1 ? col.sort : acc }), {});
  });
};

export function normalizeSelectObj(tblThColomns: TableThModel[]): Record<string, any> {
  const selectObj: Record<string, any> = {};

  const parse = (str: string): any => {
    const stack: any[] = [];
    let curr: any = {};
    let key = '', i = 0;

    const pushKey = () => {
      if (key.trim()) curr[key.trim()] = true;
      key = '';
    };

    while (i < str.length) {
      const char = str[i];

      if (char === '[') {
        const parentKey = key.trim();
        key = '';
        const newObj: any = {};
        curr[parentKey] = { select: newObj };
        stack.push(curr);
        curr = newObj;
      } else if (char === ']') {
        pushKey();
        curr = stack.pop();
      } else if (char === ',') {
        pushKey();
      } else {
        key += char;
      }
      i++;
    }
    pushKey();
    return curr;
  };

  const deepMerge = (target: any, source: any): any => {
    for (const key in source) {
      if (
        source[key] instanceof Object &&
        target[key] instanceof Object
      ) {
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  };

  tblThColomns.forEach(col => {
    if (!col.IsVisible || !col.key) return;
    const parsed = parse(col.key);
    deepMerge(selectObj, parsed);
  });

  return selectObj;
};

export function generateOtp(length: number): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

export function stringWithTimestamp(length: number = 5): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let prefix = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    prefix += characters[randomIndex];
  }

  const timestamp = Date.now();
  return `${prefix}${timestamp}`;
};

export function removeListStateByIndex<T>(array: T[], index: number): T[] {
  return array.filter((_, i) => i !== index);
};

export function formatDate(dateString: string | Date, dtStyle: "short" | "full" | "long" | "medium" = "short", tmStyle: "short" | "full" | "long" | "medium" = "short") {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: dtStyle,
    timeStyle: tmStyle,
  }).format(date);
};

export function inputFormatPriceIdr(value: string){
  const rawValue = value.replace(/[^0-9]/g, '');
  if (rawValue === '') return;
  const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return formatted;
}
export function formatToIDR(value: string | number): string {
  const numberValue = typeof value === 'string' ? parseInt(value, 10) : value;
  return numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
export function parseFromIDR(formatted: string): number {
  return parseInt(formatted.replace(/\./g, ''), 10);
};