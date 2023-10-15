import { LoaderButton } from "@/components/ui/loader-button";
import { useUser } from "@/context";
import { User } from "@transcendence/db";

// TODO: use real data

export default function UserGameProfile({ user }: { user: User }) {
  const { user: currentUser } = useUser();

  return (
    <div>
      <div className="flex flex-col items-center space-y-1">
        <img src={user?.avatar} className="h-16 w-16 rounded-full" />
        <p className="">{user.name}</p>
      </div>
      <div className="mt-4 flex justify-center">
        {currentUser?.id !== user.id ? (
          <PlayButton user={user} />
        ) : (
          <AddFriendButton user={user} />
        )}
      </div>
      <MatchesHistory user={user} />
    </div>
  );
}

function PlayButton({ user }: { user: User }) {
  const play = () => {};
  return (
    <LoaderButton onClick={play} isLoading={false}>
      Play
    </LoaderButton>
  );
}

function AddFriendButton({ user }: { user: User }) {
  const addFriend = () => {};
  return (
    <LoaderButton onClick={addFriend} isLoading={false}>
      Add Friend
    </LoaderButton>
  );
}

function MatchesHistory({ user }: { user: User }) {
  return (
    <div className="mx-auto mt-10 max-w-[290px] space-y-4 font-boogaloo text-2xl">
      <div className="flex justify-between">
        <p>Matches played</p>
        <p>20</p>
      </div>
      <div className="flex justify-between">
        <p>Wins</p>
        <p>20</p>
      </div>
      <div className="flex justify-between">
        <p>Loses</p>
        <p>20</p>
      </div>
      <div className="flex justify-between">
        <p>Points</p>
        <p>20</p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-3xl">Rank</p>
        <p className="text-7xl">29</p>
      </div>
    </div>
  );
}
