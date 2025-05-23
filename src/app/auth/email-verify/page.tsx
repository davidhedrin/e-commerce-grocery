"use client";

import LoadingUI from "@/components/loading-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { ZodErrors } from "@/components/zod-errors";
import Configs from "@/lib/config";
import { FormState } from "@/lib/models-type";
import { SonnerPromise } from "@/lib/utils";
import { emailVerify } from "@/server/auth";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function EmailVerifyPage() {
  const appName = Configs.app_name;
  const { push } = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    if (!token || token.trim() === '') {
      toast.warning("Invalid Token!", {
        description: "Looks like something wrong with your url. Click the link and try again!",
      });
      push("/auth");
    } else {
      setShouldRender(true);
    }
  }, [token]);

  const [txtOtpCode, setTxtOtpCode] = useState("");
  const [stateForm, setStateForm] = useState<FormState>({ success: false, errors: {} });
  const FormSchemaChangePass = z.object({
    otp_code: z
      .string()
      .min(6, { message: 'OTP must consist of 6 digits.' })
      .trim(),
  });

  const handleSubmitForm = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const valResult = FormSchemaChangePass.safeParse(data);
    if (!valResult.success) {
      setStateForm({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateForm({ success: true, errors: {} });
    
    if (!token || token.trim() === '') {
      toast.warning("Invalid Token!", {
        description: "Looks like something wrong with your url. Click the link and try again!",
      });
      return;
    }

    setLoadingSubmit(true);
    setTimeout(async () => {
      const sonnerSignIn = SonnerPromise("Verifying Email...", "Wait a moment, we try to verified your account.");
      try {
        formData.append('token', token);
        await emailVerify(formData);

        toast.success("Verified success!", {
          description: "Your account has been verified successfully.",
        });
        push("/auth");
      } catch (error: any) {
        toast.warning("Request Failed!", {
          description: error.message,
        });
      }
      toast.dismiss(sonnerSignIn);
      setLoadingSubmit(false);
    }, 100);
  };

  if (!shouldRender) return (<LoadingUI />)
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted px-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="px-1 py-0.5 rounded-lg bg-blue-600 text-sidebar-primary-foreground">
            <i className='bx bx-shopping-bag text-3xl'></i>
          </div>
          <div className="text-xl text-blue-600">
            {appName}
          </div>
        </a>

        <Card className="gap-5">
          <CardHeader className="text-center gap-0">
            <div className="flex justify-center mb-3">
              <Image
                src="/assets/img/envelope-success.png"
                alt="Page Not Found"
                width={100}
                height={100}
              />
            </div>

            <CardTitle className="text-xl">Verified your Email!</CardTitle>
            <CardDescription>
              Your almost finish your registration, Verify your email with the 6 digit verification code OTP belows.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={(formData) => handleSubmitForm(formData)} className="grid gap-4">
              <div className="flex flex-col justify-center items-center gap-1">
                <InputOTP value={txtOtpCode} onChange={(val) => setTxtOtpCode(val)} maxLength={6} name="otp_code">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {stateForm.errors?.otp_code && <ZodErrors err={stateForm.errors?.otp_code} />}
              </div>

              <Button disabled={loadingSubmit} type="submit" className="w-full cursor-pointer primary">
                {loadingSubmit ? "Verifying..." : "Verified Now"}
              </Button>

              <div className="text-center text-sm">
                <i className='bx bx-left-arrow-alt text-lg'></i> Back to&nbsp;
                <span onClick={() => push("/auth")} className="underline underline-offset-4 cursor-pointer">
                  Login
                </span>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "} and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
