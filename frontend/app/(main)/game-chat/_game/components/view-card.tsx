import { ToggleLeft } from "lucide-react";
import { ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ViewCard() {
  return (
    <>
      <div className="mt-10 flex flex-col gap-16 rounded-md border border-border bg-card px-4 py-12 ">
          <h1 className="text-center text-2xl text-foreground">2D/3D :</h1>
          <div className="flex flex-wrap justify-center gap-10 xl:gap-40">
            <Button className="space-x-2 bg-transparent">
              <ToggleLeft />
              <h1 className="text-center text-2xl text-foreground">2D</h1>
            </Button>
            <Button className="space-x-2 bg-transparent">
              <ToggleRight />
              <h1 className="text-center text-2xl text-foreground">3D</h1>
            </Button>
          </div>
        </div>
    </>
  )
}