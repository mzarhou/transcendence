import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserLoginForm } from "./user-login-form";
import { ModeToggle } from "@/components/mode-toggle";

export default function () {
  return (
    <>
      <div className="absolute right-4 top-4 flex items-center md:right-8 md:top-8">
        <Link
          href="/signup"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mr-4"
          )}
        >
          Sign Up
        </Link>
        <ModeToggle />
      </div>
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
