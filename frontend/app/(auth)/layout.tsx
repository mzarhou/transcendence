import { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="container relative grid h-screen flex-col items-center justify-center py-10 lg:max-w-none lg:grid-cols-2 lg:px-0 lg:py-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
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
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>
              and
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
