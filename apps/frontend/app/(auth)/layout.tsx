"use client";

import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Guest from "../Guest";
import Lottie from "react-lottie";
import GameHomeLottie from "lotties/game-home-lottie.json";

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
        <div className="hidden h-full flex-col border-gray-50/5 p-20 text-foreground lg:flex">
          <Lottie
            style={{
              padding: 0,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundImage: "url(/login-image.png)",
            }}
            options={{
              animationData: GameHomeLottie,
              loop: true,
              autoplay: true,
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
