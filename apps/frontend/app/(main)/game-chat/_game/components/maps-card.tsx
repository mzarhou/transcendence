

export default function MapsCard() {
  return (
    <>
      <div className="flex flex-col gap-16 rounded-md border border-border bg-card px-4 py-12 md:items-center">
          <h1 className="text-center text-2xl text-foreground">MAP :</h1>
          <div className="flex flex-wrap justify-center gap-10">
            <div className="h-[127px] w-[130px] border-2 border-border"></div>
            <div className="h-[127px] w-[130px] border-2 border-border"></div>
            <div className="h-[127px] w-[130px] border-2 border-border"></div>
            <div className="h-[127px] w-[130px] border-2 border-border"></div>
          </div>
        </div>
    </>
  )
}