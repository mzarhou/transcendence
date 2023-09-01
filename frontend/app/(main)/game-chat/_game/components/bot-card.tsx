import { Button } from "@/components/ui/button";
import { ToggleLeft } from "lucide-react";
import { ToggleRight } from "lucide-react";

export default function BotCard() {
  return (
    <>
      <div className="mt-10 flex flex-col gap-16 rounded-md border border-border bg-card px-4 py-12 ">
          <h1 className="text-center text-2xl text-foreground">BOT LEVEL :</h1>
          <div className="flex flex-wrap justify-center gap-10">
            <Button className="space-x-2 bg-transparent">
              <ToggleLeft />
              <h1 className="text-center text-2xl text-foreground">EASY</h1>
            </Button>
            <Button className="space-x-2 bg-transparent">
              <ToggleRight />
              <h1 className="text-center text-2xl text-foreground">MEDIUM</h1>
            </Button>
            <Button className="space-x-2 bg-transparent">
              <ToggleLeft />
              <h1 className="text-center text-2xl text-foreground">HARD</h1>
            </Button>
          </div>
        </div>
    </>
  )
}