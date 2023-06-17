"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { FormEvent } from "react";
import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { Loader2 } from "lucide-react";

export default function Disable2fa() {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const { trigger: disable2FA, isMutating } = useSWRMutation(
    "/authentication/2fa/disable",
    async (url, { arg: event }: { arg: FormEvent<HTMLFormElement> }) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);
      const tfaCode = formData.get("code") as string;
      await api.post(url, { tfaCode });
    },
    {
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
      onSuccess: () => {
        toast({
          description: "2FA is disabled",
          className: "bg-green-200",
        });
        mutate("/users/me");
      },
    }
  );

  return (
    <>
      <div>
        <form onSubmit={(e) => disable2FA(e).catch((_err) => {})}>
          <Button type="submit" disabled={isMutating} className="block">
            {isMutating ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span>Disable 2FA</span>
            )}
          </Button>
          <input
            name="code"
            className="px-4 py-2 border rounded-sm mt-4"
            placeholder="2fa code"
          />
        </form>
      </div>
    </>
  );
}
