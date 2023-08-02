"use client";

import { useForm } from "react-hook-form";
import GoBackBtn from "../../components/chat-go-back";
import { CreateGroupType, createGroupSchema } from "@transcendence/common";
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
import { useCreateGroup } from "@/api-hooks/use-create-groups";
import { LoaderButton } from "@/components/ui/loader-button";
import { useEffect } from "react";

export default function CreateGroupPage() {
  const { trigger, isMutating } = useCreateGroup();

  const form = useForm<CreateGroupType>({
    resolver: zodResolver(createGroupSchema),
  });

  const watchGroupStatus = form.watch("status");
  useEffect(() => {
    if (watchGroupStatus !== "PROTECTED") form.setValue("password", undefined);
  }, [watchGroupStatus]);

  function submit(data: CreateGroupType) {
    trigger(data);
  }

  return (
    <>
      <GoBackBtn>
        <h3 className="sm">Create Group</h3>
      </GoBackBtn>
      <div className="flex h-0 w-full flex-grow flex-col space-y-8 overflow-y-auto px-1 pt-8 md:p-4 md:px-6 md:pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
            <div className="">
              <Input
                type="file"
                className="mx-auto h-24 w-24 rounded-full bg-primary/20 file:text-transparent"
              />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Group name"
                      {...field}
                      value={field.value ?? ""}
                    />
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
                      onValueChange={(v: "PRIVATE" | "PROTECTED" | "PUBLIC") =>
                        field.onChange(v)
                      }
                      defaultValue={field.value}
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
                        type="password"
                        placeholder="********"
                        {...field}
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
              Create
            </LoaderButton>
          </form>
        </Form>
      </div>
    </>
  );
}
