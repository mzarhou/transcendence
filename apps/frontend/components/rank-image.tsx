import { Division } from "@transcendence/db";
import Image, { StaticImageData } from "next/image";
import Bronze from "public/images/Season_2022_-_Bronze.webp";
import Diamond from "public/images/Season_2022_-_Diamond.webp";
import Gold from "public/images/Season_2022_-_Gold.webp";

const data: Record<Division, StaticImageData> = {
  Bronze: Bronze,
  Gold: Gold,
  Legend: Diamond,
  Nooby: Bronze,
};

export function RankImage({
  division,
  className,
  width,
}: {
  division: Division;
  className?: string;
  width?: number;
}) {
  if (division === "Nooby") return <></>;
  return (
    <Image
      src={data[division]}
      alt=""
      width={width ?? 100}
      className={className}
    />
  );
}
