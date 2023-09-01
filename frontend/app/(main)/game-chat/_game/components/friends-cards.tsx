import Image from "next/image";
import ababouel from "/public/images/ababouel.jpeg";
import mzarhou from "/public/images/mzarhou.jpeg";
import fechcha from "/public/images/fech-cha.jpeg";
import sismaili from "/public/images/sismaili.jpeg";

export default function FriendsCards() {
  return (
    <>
      <div className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-between gap-4 xl:gap-4">
        <CardsData profile={ababouel} user="ababouel" rank="Rank 10" />
        <CardsData profile={mzarhou} user="mzarhou" rank="Rank 9" />
        <CardsData profile={fechcha} user="fech-cha" rank="Rank 8" />
      </div>
    </>
  );
}

function CardsData(props: {
  profile: typeof ababouel;
  user: string;
  rank: string;
}) {
  return (
    <>
      <div className="mx-auto h-[254px] w-[223px] rounded-lg border-2 border-border pt-10 hover:drop-shadow-lp-cards">
        <div className="flex justify-evenly">
          <Image
            src={props.profile}
            alt={props.user}
            className="h-[61px] w-[61px] rounded-full"
          />
          <div>
            <h2 className="text-lg">{props.user}</h2>
            <h2 className="text-md">{props.rank}</h2>
          </div>
        </div>
        <div className="flex justify-center space-x-5 mt-10 mx-auto">
          <div className="text-md text-foreground text-center">
            <h2>Matches<br />played</h2>
            <h2>10</h2>
          </div>
          <div className="text-md text-foreground text-center">
            <h2>Wins</h2>
            <h2>5</h2>
          </div>
          <div className="text-md text-foreground text-center">
            <h2>Loses</h2>
            <h2>5</h2>
          </div>
        </div>
      </div>
    </>
  );
}
