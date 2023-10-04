"use client";

import { Button } from "@/components/ui/button";
import { env } from "@/env/server.mjs";

export const School42LoginBtn = () => {
  return (
    <form
      method="post"
      action={`${env.NEXT_PUBLIC_API_URL}/authentication/school-42`}
    >
      <Button type="submit" variant="outline" className="w-full">
        42 School
      </Button>
    </form>
  );
};
