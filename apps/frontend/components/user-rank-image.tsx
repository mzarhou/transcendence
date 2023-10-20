import { User } from "@transcendence/db";
import { RankImage } from "./rank-image";
import { cn } from "@/lib/utils";

interface UserRankImageProps {
  user: Pick<User, "rank" | "division" | "avatar"> | undefined;
  rankImageWidth?: number;
  className?: string;
}
export default function UserRankImage(props: UserRankImageProps) {
  return (
    <div
      className={cn("relative h-full w-full", props.className)}
      title={`Rank: #${props.user?.rank}`}
    >
      <img
        src={props.user?.avatar}
        className={"mx-auto aspect-square w-full rounded-full"}
      />
      {props.user && (
        <div className="absolute inset-0 flex flex-col justify-end">
          <RankImage
            width={props.rankImageWidth}
            division={props.user.division}
            className="mx-auto -mb-[30%] w-[80%]"
          />
        </div>
      )}
    </div>
  );
}
