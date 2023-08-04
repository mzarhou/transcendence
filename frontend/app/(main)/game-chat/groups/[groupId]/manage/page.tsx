"use client";

import { useGroup } from "@/api-hooks/use-group";
import GoBackBtn from "../../../components/chat-go-back";
import FullLoader from "@/components/ui/full-loader";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { queryAtom } from "./components/search-query-atom";
import { useAtom } from "jotai";
import FullPlaceHolder from "@/components/ui/full-placeholder";
import { useGroupUsers } from "@/api-hooks/groups/use-group-users";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Members from "./components/members";
import BannedUsers from "./components/banned-users";
import { truncateText } from "@/lib/utils";

type ManageGroupPageProps = {
  params: {
    groupId: string;
  };
};
export default function ManageGroupPage({
  params: { groupId },
}: ManageGroupPageProps) {
  const router = useRouter();
  const { data: group, isLoading, error } = useGroup(groupId);

  useGroupUsers({ filter: "banned", groupId });

  useEffect(() => {
    if (group && group.role === "MEMBER") router.replace("/game-chat");
  }, [router, group]);

  return (
    <>
      <GoBackBtn>
        {group && <h3>{truncateText(group?.name, 16)}: Manage group</h3>}
      </GoBackBtn>
      <div className="mt-4 flex h-0 w-full flex-grow flex-col overflow-y-auto px-1 pt-8 md:p-4 md:px-6 md:pt-0">
        {isLoading ? (
          <FullLoader />
        ) : group ? (
          <div className="space-y-4">
            <ManageGroupInput />
            <Tabs defaultValue="members" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="banned-users">Banned Users</TabsTrigger>
              </TabsList>
              <TabsContent value="members">
                <Members group={group} />
              </TabsContent>
              <TabsContent value="banned-users">
                <BannedUsers group={group} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <FullPlaceHolder
            text={error ? "Failed getting group details" : "Group not found"}
          />
        )}
      </div>
    </>
  );
}

function ManageGroupInput() {
  const [query, setQuery] = useAtom(queryAtom);

  return (
    <Input
      placeholder="search for a user"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
