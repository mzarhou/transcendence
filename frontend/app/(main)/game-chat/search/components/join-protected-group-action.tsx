"use client";

import { userJoinGroup } from "@/api-hooks/groups/use-join-group";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderButton } from "@/components/ui/loader-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Group, JoinGroupType, joinGroupSchema } from "@transcendence/common";
import { useState } from "react";
import { useForm } from "react-hook-form";

type JoinProtectedGroupActionProps = {
  group: Group;
};
export default function JoinProtectedGroupAction({
  group,
}: JoinProtectedGroupActionProps) {
  const [open, setOpen] = useState(false);
  const { isMutating, trigger } = userJoinGroup(group);

  const form = useForm<JoinGroupType>({
    resolver: zodResolver(joinGroupSchema),
  });

  async function submit(data: JoinGroupType) {
    try {
      await trigger(data);
      setOpen(false);
    } catch (_error) {}
  }

  if (group.status !== "PROTECTED") {
    return (
      <LoaderButton isLoading={isMutating} onClick={() => trigger({})}>
        Join
      </LoaderButton>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Join</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <h3 className="border-b pb-2 text-lg">Join {group.name} group</h3>
          <form onSubmit={form.handleSubmit(submit)}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <LoaderButton isLoading={isMutating} className="mt-4">
              Join
            </LoaderButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
