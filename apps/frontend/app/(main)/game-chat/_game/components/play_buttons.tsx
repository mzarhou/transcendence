import { Button } from "@/components/ui/button";

export default function PlayButtons() {
  
  return (
    <>
      <div className="fixed top-[77%] gap-1 flex flex-col xl:top-3/4 xl:flex-row xl:gap-10">
        <Button className="h-9 my-1 xl:h-[106px] xl:w-[220px] border-2 border-border bg-transparent text-lg xl:text-2xl">
          Play offline
        </Button>
        <Button className="h-9 my-1 xl:h-[106px] xl:w-[220px] border-2 border-border bg-transparent text-lg xl:text-2xl">
          Vs friend
        </Button>
        <Button className="h-9 my-1 xl:h-[106px] xl:w-[220px] border-2 border-border bg-transparent text-lg xl:text-2xl">
          Ranked
        </Button>
      </div>
    </>
  )
}