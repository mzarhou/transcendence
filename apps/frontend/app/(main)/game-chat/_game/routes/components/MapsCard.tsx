import { useState } from "react";
import { COURT } from "../../state/board";
import Image from "next/image";

export default function MapsCard() {
  const [court, setCourt] = useState<number>();
  const images = [
    { id: 0, src: COURT.BBLACK },
    { id: 1, src: COURT.BBLUE },
    { id: 2, src: COURT.BGREEN },
    { id: 3, src: COURT.BORANGE },
  ];
  const handleChange = (id: number) => {
    let data = images[id];
    localStorage.setItem("court", data.src);
    setCourt(id);
  };

  return (
    <>
      <div className="flex flex-col gap-16 rounded-md border border-border bg-card px-4 py-12 md:items-center">
        <h1 className="text-center text-2xl text-foreground">MAP :</h1>
        <div className="flex flex-wrap justify-center gap-10">
          {images.map((image) => (
            <div
              className={`h-[140px] w-[100px] border-2 border-border ${
                court === image.id ? "border-white" : "border-gray"
              }`}
            >
              <Image
                src={`${image.src}`}
                onClick={() => {
                  handleChange(image.id);
                }}
                width={100}
                height={133}
                alt={"OrangeCourt"}
                className="image-button"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
