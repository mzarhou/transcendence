import { usePostFriendRequest } from "@/api-hooks/friend-requests/use-post-friend-request";
import { useCreateGameInvitation } from "@/api-hooks/game/use-create-game-invitation";
import { useGameProfile } from "@/api-hooks/game/use-game-profile";
import FullLoader from "@/components/ui/full-loader";
import FullPlaceHolder from "@/components/ui/full-placeholder";
import { LoaderButton } from "@/components/ui/loader-button";
import UserRankImage from "@/components/user-rank-image";
import { useUser } from "@/context";
import { GameProfile } from "@transcendence/db";
import { Gamepad2, Plus, UserPlus } from "lucide-react";
import { Gamepad } from "lucide-react";

export default function UserGameProfile({ userId }: { userId: number }) {
  const { user: currentUser, isLoading: isLoadingUser } = useUser();
  const { data: profile, isLoading } = useGameProfile(userId);

  if (isLoading || isLoadingUser) return <FullLoader />;

  if (!profile || !currentUser)
    return <FullPlaceHolder text="Failed fetching user game profile" />;

  return (
    <div className="text-foreground/80">
      <div className="flex flex-col items-center space-y-2">
        <UserRankImage user={profile} className="h-16 w-16" />
        <p>{profile.name}</p>
      </div>
      <div className="mt-4 flex justify-center">
        {currentUser.id !== profile.id &&
          (profile.isFriend ? (
            <PlayButton profile={profile} />
          ) : (
            <AddFriendButton profile={profile} />
          ))}
      </div>
      <MatchesHistory profile={profile} />
    </div>
  );
}

function PlayButton({ profile }: { profile: GameProfile }) {
  const { trigger: sendGameInvitation, isMutating } = useCreateGameInvitation();

  const play = () => {
    try {
      sendGameInvitation({ friendId: profile.id });
    } catch (error) {}
  };

  return (
    <LoaderButton onClick={play} isLoading={isMutating} className="space-x-2">
      <Gamepad2 size={20} />
      <span>Play</span>
    </LoaderButton>
  );
}

function AddFriendButton({ profile }: { profile: GameProfile }) {
  const { isMutating, trigger } = usePostFriendRequest();

  return (
    <LoaderButton
      onClick={() => {
        trigger({ targetUserId: profile.id });
      }}
      isLoading={isMutating}
      className="space-x-2"
    >
      <UserPlus size={20} />
      <span>Add Friend</span>
    </LoaderButton>
  );
}

function MatchesHistory({ profile }: { profile: GameProfile }) {
  return (
    <div className="mx-auto mt-10 max-w-[290px] space-y-4 font-boogaloo text-2xl">
      <div className="flex justify-between">
        <p>Matches played</p>
        <p>{profile.numOfGames}</p>
      </div>
      <div className="flex justify-between">
        <p>Wins</p>
        <p>{profile.nbWins}</p>
      </div>
      <div className="flex justify-between">
        <p>Loses</p>
        <p>{profile.nbLoses}</p>
      </div>
      <div className="flex justify-between">
        <p>Points</p>
        <p>{profile.eloRating}</p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-3xl">Rank</p>
        <p className="text-7xl">{profile.rank}</p>
      </div>
    </div>
  );
}
