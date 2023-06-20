"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormEventHandler } from "react";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { Loader2 } from "lucide-react";

export default function () {
  const { toast } = useToast();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const { isMutating, trigger } = useSWRMutation(
    "/api/auth/provide-2fa-code",
    async (url, { arg }: { arg: FormData }) => {
      return axios.post(url, arg).catch((err) => {
        if (err instanceof AxiosError) {
          throw err.message;
        }
        throw "Unkown error";
      });
    },
    {
      onSuccess: () => {
        toast({
          description: "You are logged in",
        });
        mutate("/users/me");
        router.replace("/");
      },
      onError: (error) => {
        let message = "Failed";
        if (error instanceof AxiosError) {
          message = error.message;
        }
        toast({
          description: message,
          className: "bg-red-200",
        });
      },
    }
  );

  const submit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    trigger(formData);
  };

  return (
    <form className="mx-auto mt-16 w-full max-w-md" onSubmit={submit}>
      <div className="text-center text-xl font-semibold">
        Two-Factor Authentication
      </div>
      <div className="mt-8 flex flex-col">
        <span>Verification Code</span>
        <input
          name="code"
          className="mt-2 rounded-sm border px-4 py-2 text-xl"
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
  );
}
