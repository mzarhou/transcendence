"use client";

import { useForm } from "react-hook-form";
import { UpdateGroupType, updateGroupSchema } from "@transcendence/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderButton } from "@/components/ui/loader-button";
import { useEffect } from "react";
import { useUpdateGroup } from "@/api-hooks/groups/use-update-group";
import GoBackBtn from "../../../components/chat-go-back";
import { GroupType, useGroup } from "@/api-hooks/groups/use-group";
import FullLoader from "@/components/ui/full-loader";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import FullPlaceHolder from "@/components/ui/full-placeholder";
import { truncateText } from "@/lib/utils";

type GroupInfoPageProps = {
  params: {
    groupId: string;
  };
};

export default function UpdateGroupPage({
  params: { groupId },
}: GroupInfoPageProps) {
  const { data: group, isLoading, error } = useGroup(groupId);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (group && user && group.ownerId !== user.id)
      router.replace("/game-chat");
  }, [router, group, user]);

  return (
    <>
      <GoBackBtn>
        {group && (
          <h3 title={group.name}>
            {truncateText(group?.name, 16)}: Update settings
          </h3>
        )}
      </GoBackBtn>
      {isLoading ? (
        <FullLoader />
      ) : group ? (
        <UpdateGroupBody group={group} />
      ) : (
        <FullPlaceHolder
          text={error ? "Failed getting group details" : "Group not found"}
        />
      )}
    </>
  );
}

type UpdateGroupBodyProps = {
  group: GroupType;
};
function UpdateGroupBody({ group }: UpdateGroupBodyProps) {
  const { trigger, isMutating } = useUpdateGroup("" + group.id);
  const form = useForm<UpdateGroupType>({
    resolver: zodResolver(updateGroupSchema),
    defaultValues: {
      name: group?.name,
      status: group?.status,
    },
  });

  function getChangedFields(data: UpdateGroupType) {
    const statusChanged = data.status !== group.status;
    if (data.name === group.name) data.name = undefined;
    if (!statusChanged) data.status = undefined;
    if (
      data.status !== "PROTECTED" ||
      (data.status !== "PROTECTED" && !statusChanged)
    )
      data.password = undefined;
    return data;
  }

  const watchGroupStatus = form.watch("status");
  useEffect(() => {
    if (watchGroupStatus !== "PROTECTED") form.setValue("password", undefined);
  }, [watchGroupStatus]);

  function submit(data: UpdateGroupType) {
    trigger(getChangedFields(data));
  }

  return (
    <div className="flex h-0 w-full flex-grow flex-col space-y-8 overflow-y-auto px-1 pt-8 md:p-4 md:px-6 md:pt-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
          <div className="">
            <img
              src={group.avatar}
              className="mx-auto h-24 w-24 rounded-full"
            />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Group name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a group type:</FormLabel>
                <FormControl>
                  <RadioGroup
                    className="ml-2 space-y-1"
                    defaultValue={field.value}
                    onValueChange={(v: "PRIVATE" | "PROTECTED" | "PUBLIC") =>
                      field.onChange(v)
                    }
                  >
                    <FormItem className="mt-2 flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="PUBLIC" />
                      </FormControl>
                      <FormLabel>Public</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="PRIVATE" />
                      </FormControl>
                      <FormLabel>Private</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="PROTECTED" />
                      </FormControl>
                      <FormLabel>Protected</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          {watchGroupStatus === "PROTECTED" ? (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="********"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          <LoaderButton
            className="mx-auto block"
            type="submit"
            isLoading={isMutating}
          >
            Update
          </LoaderButton>
        </form>
      </Form>
    </div>
  );
}
