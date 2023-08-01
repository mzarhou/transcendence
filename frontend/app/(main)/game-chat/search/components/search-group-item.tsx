import { Button } from "@/components/ui/button";
import { SearchGroup } from "@transcendence/common";

type SearchGroupItemProps = {
  className?: string;
  group: SearchGroup;
};
export default function SearchGroupItem({ group }: SearchGroupItemProps) {
  return (
    <div className="relative flex justify-between">
      <div className="flex flex-grow space-x-4">
        <div className="relative flex aspect-square h-[72px] items-center justify-center rounded-full bg-gray-100/10 text-lg">
          <img src={group.avatar} className="rounded-full" />
        </div>
        <div className="mt-0.5">
          <p>{group.name}</p>
          <p className="text-sm text-chat-foreground/60">{group.status}</p>
        </div>
      </div>
      {!group.role && (
        <div className="mt-1">
          <Button>Join</Button>
        </div>
      )}
    </div>
  );
}
