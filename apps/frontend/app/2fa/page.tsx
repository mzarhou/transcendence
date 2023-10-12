"use client";

import { Button } from "@/components/ui/button";
import { FormEventHandler } from "react";
import { Loader2 } from "lucide-react";
import { useProvide2faCode } from "@/api-hooks/2fa/use-provide-2fa-code";
import Auth2fa from "../Auth2fa";
import { NavBar } from "@/components/navbar";
import { Input } from "@/components/ui/input";

export default function () {
  const { trigger, isMutating } = useProvide2faCode();

  const submit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const tfaCode = formData.get("code") as string;
    try {
      await trigger({ tfaCode });
    } catch (error) {}
  };

  return (
    <Auth2fa>
      <div className="flex min-h-screen flex-col">
        <div className="px-5 md:px-8 ">
          <NavBar />
        </div>

        <form className="mx-auto mt-16 w-full max-w-md" onSubmit={submit}>
          <div className="text-center text-xl font-semibold">
            Two-Factor Authentication
          </div>
          <div className="mt-8 flex flex-col">
            <span>Verification Code</span>
            <Input
              name="code"
              className="mt-2 rounded-sm border bg-transparent px-4 py-6 text-xl"
              placeholder="123456"
            />
          </div>
          <div className="mt-4 flex flex-col">
            <Button className="h-12" type="submit" disabled={isMutating}>
              {isMutating ? (
                <Loader2 className="animate-spin" />
              ) : (
                <span>Verify</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Auth2fa>
  );
}
