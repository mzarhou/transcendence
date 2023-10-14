import { SearchGroup } from "@transcendence/db";
import JoinProtectedGroupAction from "./join-protected-group-action";
import { useRouter } from "next/navigation";

type SearchGroupItemProps = {
  className?: string;
  group: SearchGroup;
};
export default function SearchGroupItem({ group }: SearchGroupItemProps) {
  const router = useRouter();

  const goToGroup = () => {
    if (!group.role) return;
    router.push(`/game-chat/groups/${group.id}`);
  };

  return (
    <div className="relative flex justify-between">
      <div
        className="flex flex-grow cursor-pointer space-x-4"
        onClick={goToGroup}
      >
        <div className="relative flex aspect-square h-[72px] items-center justify-center rounded-full bg-gray-100/10 text-lg">
          <img src={group.avatar} className="rounded-full" />
        </div>
        <div className="mt-0.5">
          <p>{group.name}</p>
          <p className="text-sm text-chat-card-foreground/60">{group.status}</p>
        </div>
      </div>
      {!group.role && (
        <div className="mt-1">
          <JoinProtectedGroupAction group={group} />
        </div>
      )}
    </div>
  );
}
