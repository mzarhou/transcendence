"use client";

import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Guest from "../Guest";
import PongAnimation from "@/components/pong-animation";

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
      <div className="relative grid h-screen flex-col items-center justify-center px-4 py-10 lg:max-w-none lg:grid-cols-2 lg:px-0 lg:py-0">
        <Link href="/" className="absolute left-4 top-0 md:left-8 md:top-4">
          <img src="/logo.png" className="h-20" />
        </Link>
        <div className="hidden lg:block">
          <PongAnimation />
        </div>
        <div className=" mx-auto rounded-xl border border-border bg-card/80 p-8 py-24 sm:max-w-[600px]">
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
