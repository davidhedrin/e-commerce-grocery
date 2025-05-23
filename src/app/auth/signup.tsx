"use client";

import React, { useState } from 'react'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ZodErrors } from "@/components/zod-errors";

import { signUpAction } from "@/server/auth";
import { SonnerPromise } from '@/lib/utils';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { FormState } from '@/lib/models-type';
import { z } from 'zod';

export default function AuthSignup({ setSigninSignup }: { setSigninSignup: React.Dispatch<React.SetStateAction<number>> }) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [coPassword, setCoPassword] = useState('');
  const [toggle_pass, setTogglePass] = useState(false);
  const [toggle_copass, setToggleCoPass] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [stateForm, setStateForm] = useState<FormState>({ success: false, errors: {} });
  const FormSchemaSignUp = z.object({
    fullname: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long.' })
      .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
      .string()
      .min(8, { message: 'Be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
      })
      .trim(),
    co_password: z
      .string()
      .min(8, { message: 'Be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
      })
      .trim()
  }).refine((data) => data.password === data.co_password, {
    message: "Confirmation password don't match",
    path: ["co_password"]
  });
  const handleSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const valResult = FormSchemaSignUp.safeParse(data);
    if (!valResult.success) {
      setStateForm({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateForm({ success: true, errors: {} });
    
    setLoadingSubmit(true);
    setTimeout(async () => {
      const sonnerSignUp = SonnerPromise("Creating your account...", "Please wait, we're creating your account!");
      try {
        await signUpAction(formData);
  
        toast.success("Account created successfully!", {
          description: "A verification email has been sent to your inbox for verify your registration!",
        });
        setSigninSignup(1);
      } catch (error: any) {
        toast.warning("Registration Failed!", {
          description: error.message,
        });
      }
      toast.dismiss(sonnerSignUp);
      setLoadingSubmit(false);
    }, 100)
  };

  return (
    <Card className="gap-5">
      <CardHeader className="text-center gap-0">
        <CardTitle className="text-xl">Create Account</CardTitle>
        <CardDescription>
          Let's get started with create an new account!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={(formData) => handleSubmit(formData)} className="grid gap-4">
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="fullname">Fullname</Label>
              <div>
                <Input id="fullname" name="fullname" type="text" placeholder="Ex. John Thor Doe" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                {stateForm.errors?.fullname && <ZodErrors err={stateForm.errors?.fullname} />}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div>
                <Input id="email" name="email" type="text" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                {stateForm.errors?.email && <ZodErrors err={stateForm.errors?.email} />}
              </div>
            </div>
            <div className="relative w-full">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div>
                  <Input id="password" name="password" type={toggle_pass ? "text" : "password"} placeholder='***********' value={password} onChange={(e) => setPassword(e.target.value)} />
                  {stateForm.errors?.password && <ZodErrors err={stateForm.errors?.password} />}
                </div>
              </div>
              <a
                href='#'
                className="absolute right-2 top-8 text-muted-foreground hover:text-foreground"
                onClick={() => setTogglePass((prev) => !prev)}
                tabIndex={-1}
              >
                {toggle_pass ? <EyeOff size={18} /> : <Eye size={18} />}
              </a>
            </div>
            <div className="relative w-full">
              <div className="grid gap-2">
                <Label htmlFor="co_password">Confirm Password</Label>
                <div>
                  <Input id="co_password" name="co_password" type={toggle_copass ? "text" : "password"} placeholder='***********' value={coPassword} onChange={(e) => setCoPassword(e.target.value)} />
                  {stateForm.errors?.co_password && <ZodErrors err={stateForm.errors?.co_password} />}
                </div>
              </div>
              <a
                href='#'
                className="absolute right-2 top-8 text-muted-foreground hover:text-foreground"
                onClick={() => setToggleCoPass((prev) => !prev)}
                tabIndex={-1}
              >
                {toggle_copass ? <EyeOff size={18} /> : <Eye size={18} />}
              </a>
            </div>
            <Button disabled={loadingSubmit} type="submit" className="w-full mt-2 cursor-pointer primary">
              {loadingSubmit ? "Submitting..." : "Register"}
            </Button>
          </div>
          <div className="text-center text-sm">
            Already have an account?&nbsp;
            <span onClick={() => setSigninSignup(1)} className="underline underline-offset-4 cursor-pointer">
              Sign in
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
