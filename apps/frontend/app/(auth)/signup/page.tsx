import { Metadata } from "next";
import { UserSignUpForm } from "./user-signup-form";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <>
      <div className="absolute right-4 top-4 flex items-center md:right-8 md:top-8">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mr-4"
          )}
        >
          Login
        </Link>
        <ModeToggle />
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill the form below to create your account
          </p>
        </div>
        <UserSignUpForm />
      </div>
    </>
  );
}
