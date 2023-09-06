"use client";

import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Guest from "../Guest";

export default function Layout({ children }: { children: ReactNode }) {
  const error = useSearchParams().get("error");
  const { toast } = useToast();
  const pathname = usePathname();

  useEffect(() => {
    if (error && error.length) {
      toast({
        description: error,
        variant: "destructive",
      });
      window.history.replaceState(null, "", pathname);
    }
  }, []);

  return (
    <Guest>
      <div className="container relative grid h-screen flex-col items-center justify-center py-10 lg:max-w-none lg:grid-cols-2 lg:px-0 lg:py-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-foreground dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: "url(/auth.jpg)",
            }}
          />
        </div>
        <div className="p-8">
          {children}
          <div className="mx-auto mt-6 sm:w-[350px]">
            <p className="mt-6 px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our
              <Link
                href="/terms"
                className="mx-1 underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>
              and
              <Link
                href="/privacy"
                className="ml-1 underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </Guest>
  );
}
