import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserLoginForm } from "./user-login-form";

export default function () {
  return (
    <>
      <Link
        href="/signup"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Sign Up
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login Now</h1>
          <p className="text-sm text-muted-foreground">
            Please enter your credentials below to access your account.
          </p>
        </div>
        <UserLoginForm />
      </div>
    </>
  );
}
