"use client";

import { useDisable2fa } from "@/api-hooks/use-disable-2fa";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Enable2faType, enable2faSchema } from "@transcendence/types";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Close } from "@radix-ui/react-dialog";
import { LoaderButton } from "@/components/ui/loader-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

export default function Disable2faButton() {
  const form = useForm<Enable2faType>({
    resolver: zodResolver(enable2faSchema),
    defaultValues: { tfaCode: "" },
  });
  const { disable2FA, isMutating } = useDisable2fa();

  function submit(data: Enable2faType) {
    disable2FA(data.tfaCode).catch((e) => {
      if (!(e instanceof AxiosError)) return;
      console.log(e);
      const message = e.response?.data?.message;
      if (message) {
        form.setError("tfaCode", { message });
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border border-red-200 text-red-500 hover:bg-red-100 hover:text-red-500"
        >
          Disable 2FA
        </Button>
      </DialogTrigger>
      <DialogContent className="md:w-[380px]">
        <div className="space-y-12">
          <div className="flex flex-col items-center space-y-3">
            <p className="text-center text-h4 font-semibold">
              Verify you identity
            </p>
            <p className="text-center text-gray-600">
              Enter the six-digit code from your two-factor authenticator app to
              continue.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-12">
              <FormField
                control={form.control}
                name="tfaCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2fa code</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <LoaderButton
                  type="submit"
                  className="w-full"
                  disabled={isMutating}
                >
                  Verify
                </LoaderButton>
                <Close asChild>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Close>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
