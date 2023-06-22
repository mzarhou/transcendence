import { Button } from "@/components/ui/button";
import { school42login } from "./user-42-login";

export const School42LoginBtn = () => {
  return (
    <form action={school42login}>
      <Button type="submit" variant="outline" className="w-full">
        42 School
      </Button>
    </form>
  );
};
