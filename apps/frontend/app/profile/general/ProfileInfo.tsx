"use client";

import { useUpdateProfile } from "@/api-hooks/use-update-profile";
import { useUser } from "@/app/context/user-context";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderButton } from "@/components/ui/loader-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUserType, updateUserSchema } from "@transcendence/types";
import { useForm } from "react-hook-form";

export default function ProfileInfo() {
  const { user } = useUser();

  const { trigger: update, isMutating } = useUpdateProfile();
  const form = useForm<UpdateUserType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name,
      avatar: user?.avatar,
    },
  });
  const { isDirty } = form.formState;

  return (
    <div className="flex flex-col space-y-8">
      <p className="text-h4 font-semibold">Profile Information</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((val) => update(val))}>
          <div className="flex">
            <div className="w-1/2 space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Avatar Url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoaderButton
                type="submit"
                disabled={!isDirty}
                isLoading={isMutating}
              >
                <span>Update Profile</span>
              </LoaderButton>
            </div>
            <div className="w-1/2 flex justify-center items-center">
              <img src={user?.avatar} className="h-24 w-24 rounded-full" />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
