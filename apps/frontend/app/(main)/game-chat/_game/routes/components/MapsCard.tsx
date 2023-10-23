import { useState } from "react";
import { COURT, useBoardState } from "../../state/board";
import { cn } from "@/lib/utils";

export default function MapsCard() {
  const board = useBoardState();

  const images = [
    { id: 0, src: COURT.BBLACK },
    { id: 1, src: COURT.BBLUE },
    { id: 2, src: COURT.BGREEN },
    { id: 3, src: COURT.BORANGE },
  ];

  const handleChange = (id: number) => {
    let data = images[id];
    localStorage.setItem("court", data.src);
    board.setTexture();
  };

  return (
    <>
      <div className="flex flex-col gap-16 rounded-md border border-border bg-card px-4 py-12 md:items-center">
        <h1 className="text-center text-2xl text-foreground">MAP :</h1>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 xl:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={cn("border-gray rounded-md border", {
                "border-[6px] border-blue-500": board.txtu === image.src,
              })}
            >
              <img
                src={`${image.src}`}
                onClick={() => {
                  handleChange(image.id);
                }}
                alt={"OrangeCourt"}
                className="aspect-square w-full cursor-pointer shadow-xl hover:shadow-primary"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
