"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import z from "zod";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useEnable2fa } from "@/api-hooks/use-enable-2fa";
import { AxiosError } from "axios";
import { Close } from "@radix-ui/react-dialog";

export default function Enable2faButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Set up two-factor authentication</Button>
      </DialogTrigger>
      <Enable2faPoppupContent />
    </Dialog>
  );
}

function Enable2faPoppupContent() {
  const {
    data: qrcode,
    isLoading: isLoadingImage,
    error: errorLoadingImage,
  } = useSWR(
    "/authentication/2fa/generate",
    (url) => {
      return api.get(url, { responseType: "arraybuffer" }).then((res) => {
        const base64Image = Buffer.from(res.data, "binary").toString("base64");
        return base64Image;
      });
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return (
    <DialogContent className="max-w-[375px] sm:max-w-[425px]">
      <div className="space-y-3 overflow-y-auto">
        <h2 className="text-h2">Setup 2FA</h2>
        <div className="space-y-8">
          <div className="flex flex-col items-center">
            <p className="text-h4">Scan QR Code</p>
            <p className="mt-1 text-center text-sm text-gray-600">
              Scan the image below with the 2FA authenticator app on your phone.
            </p>
            <div className="mt-4">
              {isLoadingImage || errorLoadingImage ? (
                <Loader2 className="my-8 block animate-spin" />
              ) : (
                <img
                  src={`data:image/png;base64,${qrcode}`}
                  className="bg-white"
                />
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-base">
                Enter the six-digit code from the application
              </p>
              <p className="text-sm text-gray-600">
                After scanning the barcode above, the app will display a
                six-digit code that you can enter below. Upon successful
                activation, you will also be logged out of all other active
                sessions.
              </p>
            </div>
            <Enable2faForm />
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

function Enable2faForm() {
  const formSchema = z.object({
    code: z.string().regex(/\d+/),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const { enable2FA, isMutating } = useEnable2fa();

  function onSubmit(values: FormData) {
    enable2FA(values.code).catch((err) => {
      if (!(err instanceof AxiosError)) return;
      const message = err.response?.data?.message;
      form.setError("code", { message });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-end space-x-4"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input
                  className="w-full rounded-md border px-4 py-2"
                  placeholder="123456"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4">
          <Close asChild>
            <Button variant="outline">Cancel</Button>
          </Close>
          <Button type="submit" disabled={isMutating}>
            {isMutating ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span>Enable</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
