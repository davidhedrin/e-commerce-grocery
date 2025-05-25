"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Configs from '@/lib/config';
import { SonnerPromise } from '@/lib/utils';
import { EmailVerification } from '@/server/email';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react'
import { toast } from 'sonner';

export default function SendEmailVerification() {
  const appName = Configs.app_name;
  const { push } = useRouter();

  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const handleSubmitForm = async () => {
    if (!email) return;

    setLoadingSubmit(true);
    setTimeout(async () => {
      const sonnerSignIn = SonnerPromise("Sending Email...", "Wait a moment, we try to send email verification link.");
      try {
        await EmailVerification(email);

        toast.success("Email sent successfully!", {
          description: "A verification email has been sent to your inbox for verify your registration!",
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
  }
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted px-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="px-1 py-0.5 rounded-lg bg-blue-600 text-primary-foreground">
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
                src="/assets/img/send-envelope.png"
                alt="Page Not Found"
                width={90}
                height={90}
              />
            </div>

            <CardTitle className="text-xl">Please Verify Your Email</CardTitle>
            <CardDescription>
              Can't find the email? Maybe in your spam folder. Or click below to send it again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <div>
                  <Input readOnly value={email || ""} />
                </div>
                <Button onClick={handleSubmitForm} disabled={loadingSubmit} type="submit" className="w-full mt-2">
                  {loadingSubmit ? "Sending..." : "Send Email Verification"}
                </Button>
              </div>

              <div className="text-center text-sm">
                <i className='bx bx-left-arrow-alt text-lg'></i> Back to&nbsp;
                <span onClick={() => push("/auth")} className="underline underline-offset-4 cursor-pointer">
                  Login
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "} and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
