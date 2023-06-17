"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { FormEvent } from "react";
import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Enable2fa() {
  return (
    <div className="mt-4">
      <div className="space-y-12">
        <h2 className="text-h2 font-normal">Security</h2>
        <h4 className="bg-gray-100 border-t"></h4>
        <div className="flex flex-col space-y-12">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-3">
              <h2 className="text-h4 font-semibold">
                Two-factor authentication
              </h2>
              <p className="text-base text-gray-600">
                Use an authentication app to get a verification code to log into
                your Transcendence account safely.
              </p>
            </div>
            <div className="flex flex-col">
              <hr className="my-4 w-full border-t border-gray-100 mt-0" />
              <div className="flex justify-between items-center">
                <div className="flex space-x-3 items-center">
                  <div
                    className="icon-container icon-md text-gray-500"
                    aria-hidden="true"
                  >
                    {/* prettier-ignore */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-smartphone"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
                  </div>
                  <p className="text-base">Authenticator App</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={"outline"}>
                      Set up two-factor authentication
                    </Button>
                  </DialogTrigger>
                  <Enable2faPoppupContent />
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {qrcode.length ? (
        <div>
          <img
            src={`data:image/png;base64,${qrcode}`}
            className="border mt-2"
          />
          <form
            onSubmit={(e) => enable2FA(e).catch((_err) => {})}
            className="mt-2"
          >
            <input
              name="code"
              className="border px-4 py-2 rounded-sm"
              placeholder="2fa code"
            />
            <Button type="submit" disabled={isMutating} className="ml-2">
              {isMutating ? (
                <Loader2 className="animate-spin" />
              ) : (
                <span>Enable</span>
              )}
            </Button>
          </form>
        </div>
      ) : (
        <></>
      )} */}
    </div>
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
    <DialogContent className="sm:max-w-[425px] max-w-[375px]">
      <div className="space-y-3 overflow-y-auto">
        <h2 className="text-h2">Setup 2FA</h2>
        <div className="space-y-8">
          <div className="flex flex-col items-center">
            <p className="text-h4">Scan QR Code</p>
            <p className="mt-1 text-sm text-center text-gray-600">
              Scan the image below with the 2FA authenticator app on your phone.
            </p>
            <div className="mt-4">
              {isLoadingImage || errorLoadingImage ? (
                <Loader2 className="block my-8 animate-spin" />
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

  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const { trigger: enable2FA, isMutating } = useSWRMutation(
    "/authentication/2fa/enable",
    async (url, { arg: tfaCode }: { arg: string }) => {
      return api.post(url, {
        tfaCode,
      });
    },
    {
      onError: (error) => {
        let message = "Failed to enable 2FA";
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
          description: "2FA is enabled",
          className: "bg-green-200",
        });
        mutate("/users/me");
      },
    }
  );
  function onSubmit(values: FormData) {
    enable2FA(values.code).catch((_err) => {});
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
                  className="px-4 py-2 rounded-md border w-full"
                  placeholder="123456"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button type="submit" disabled={isMutating}>
            {isMutating ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span> Enable</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
