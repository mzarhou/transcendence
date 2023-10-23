"use client";

import { useUpdateProfile } from "@/api-hooks/use-update-profile";
import { useUser } from "@/context/user-context";
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
import { UpdateUserType, updateUserSchema } from "@transcendence/db";
import { useForm } from "react-hook-form";
import ConfirmDialog from "@/components/confirm-dialog";
import { useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { useUploadProfileImage } from "@/api-hooks/use-upload-profile-image";

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
        <form
          onSubmit={form.handleSubmit((val) => {
            try {
              update(val);
            } catch (error) {}
          })}
        >
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
              <LoaderButton
                type="submit"
                disabled={!isDirty}
                isLoading={isMutating}
              >
                <span>Update Profile</span>
              </LoaderButton>
            </div>
            <div className="flex w-1/2 items-center justify-center">
              <UpdateImage />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

function UpdateImage() {
  const { user } = useUser();
  const [file, setFile] = useState<File | undefined>();
  const { trigger: uploadProfileImage, isMutating } = useUploadProfileImage();

  const uploadFile = async () => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.set("image", file);
      await uploadProfileImage(formData);
    } catch (error) {}
  };

  return (
    <ConfirmDialog
      trigger={
        <div className="relative cursor-pointer">
          <img src={user?.avatar} className="h-24 w-24 rounded-full" />
          <div className="absolute inset-0 z-10 rounded-full bg-slate-900/50"></div>
          <UploadCloud className="absolute left-[50%] right-0 top-[50%] z-50 -ml-[12px] -mt-[4px] text-white" />
        </div>
      }
    >
      {({ close }) => (
        <div className="space-y-4">
          {file ? (
            <>
              <div className="relative mx-auto w-[70%]">
                <img
                  src={URL.createObjectURL(file)}
                  className="w-full rounded-lg"
                />
                <button onClick={() => setFile(undefined)}>
                  <X className="absolute right-0 top-0" />
                </button>
              </div>
              <LoaderButton
                className="mx-auto block"
                isLoading={isMutating}
                onClick={uploadFile}
              >
                Upload
              </LoaderButton>
            </>
          ) : (
            <div className="flex w-full items-center justify-center">
              <label
                htmlFor="dropzone-file"
                className="border-card-300 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card/70"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <UploadCloud />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, OR JPEG (MAX. 1MB)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    const files = event.target.files;
                    if (files?.length) {
                      setFile(files[0]);
                    }
                  }}
                />
              </label>
            </div>
          )}
        </div>
      )}
    </ConfirmDialog>
  );
}
