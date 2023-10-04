"use client";

import { useFriendRequests } from "@/api-hooks/friend-requests/use-friend-requests";
import FullLoader from "@/components/ui/full-loader";
import { FriendRequestItem } from "../components/friend-request-item";
import GoBackBtn from "../components/chat-go-back";

export default function FriendRequestsPage() {
  const { data, isLoading } = useFriendRequests();
  if (isLoading) return <FullLoader />;

  const friendRequestsCount = data?.length ?? 0;
  return (
    <>
      <GoBackBtn>
        <h3 className="sm">Friend requests</h3>
      </GoBackBtn>
      <div className="flex h-0 flex-grow flex-col pt-8 md:px-4 md:pt-0">
        {friendRequestsCount > 0 ? (
          <div className="mt-5 flex-grow space-y-8 overflow-y-scroll pb-4">
            {data!.map((friendRequest) => (
              <FriendRequestItem
                key={friendRequest.id}
                friendRequest={friendRequest}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-grow items-center justify-center text-lg text-chat-card-foreground/60">
            No friend request
          </div>
        )}
      </div>
    </>
  );
}
