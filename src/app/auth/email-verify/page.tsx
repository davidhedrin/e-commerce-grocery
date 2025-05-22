"use client";

import { useRouter } from "next/navigation";
import { use, useCallback, useEffect } from "react";
import { toast } from "sonner";

export default function EmailVerifyPage({ params }: { params: Promise<{ [key: string]: string }> }) {
  const appName = process.env.NEXT_PUBLIC_APPS_NAME || "";
  const { push } = useRouter();
  const { token } = use(params);

  const handleEmailVerify = useCallback(async () => {
    if (token === undefined || token.toString().trim() === "") {
      toast.warning("Invalid Token!", {
        description: "Looks like your token is missing. Click the link and try again!",
      });
      return;
    }

    // Verify Token Here
  }, [token]);

  useEffect(() => {
    handleEmailVerify();
  }, []);

  return (
    <div>
      
    </div>
  )
}
