import { Button } from "@/components/ui/button";
import ProfilePage from "../settings/page";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Onboarding() {
  return (
    <div className="mx-auto mt-16 flex max-w-screen-md flex-col space-y-12">
      <Link href="/game-chat" replace={true} className="self-end">
        <Button variant="outline" className="space-x-1 text-foreground/80">
          <span>Skip</span>
          <ChevronRight size={20} />
        </Button>
      </Link>
      <ProfilePage />
    </div>
  );
}
