import { Input } from "@/components/ui/input";
import { MoreVertical } from "lucide-react";

export default function Game() {
  return (
    <>
      <Input placeholder="Search @username, groups" />
      <div className="space-y-4">
        <div className="flex justify-between">
          <h3 className="text-sm">Your groups</h3>
          <MoreVertical className="h-5 w-5" />
        </div>
        <div className="mt-4 flex space-x-4 overflow-x-auto">
          {Array(5)
            .fill(null)
            .map(() => (
              <GroupItem />
            ))}
        </div>
      </div>
      <div className="flex h-full flex-grow flex-col space-y-4 pb-60">
        <div>
          <h3 className="text-sm">Friends</h3>
        </div>
        <div className="h-full flex-grow space-y-4 overflow-y-auto">
          {Array(100)
            .fill(null)
            .map((_, index) => (
              <FriendItem id={index + 1} />
            ))}
        </div>
      </div>
    </>
  );
}

function GroupItem() {
  return (
    <div className="relative aspect-square h-20 rounded-full bg-gray-200"></div>
  );
}

function FriendItem({ id }: { id: number }) {
  return (
    <div className="flex justify-between">
      <div className="flex space-x-4">
        <div className="relative flex aspect-square h-[72px] items-center justify-center rounded-full bg-gray-200 text-lg">
          <span className="text-gray-500">{id}</span>
          <div className="absolute bottom-1.5 right-0.5 h-4 w-4 rounded-full border-2 border-chat bg-green-400"></div>
        </div>
        <div className="mt-0.5">
          <p>Farouk Ech</p>
          <p className="text-sm text-chat-foreground/60">In game</p>
          <p className="text-sm text-chat-foreground/60">#60</p>
        </div>
      </div>
      <div className="">
        <MoreVertical className="h-6 w-6" />
      </div>
    </div>
  );
}
