"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import { api } from "~/trpc/react";
import { useUser } from "@clerk/nextjs";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { LoadingSpinner } from "~/app/_components/loading";

export const CreatePostWizard = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const { user } = useUser();
  const ctx = api.useUtils();
  const cache = useQueryClient().getQueryCache();

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  const onClickPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setInput("");
      console.log("cache: ", cache); // empty cache not sure why
      // invalidate function not working, fallback to using router.refresh()
      //void ctx.post.getAll.invalidate().then(() => console.log("invalidated")); // invalidateQueries is used to invalidate and refetch queries in the cache
    },
    onError: (e) => {
      const errMsg = e.data?.zodError?.fieldErrors.content;

      toast.error(
        errMsg?.[0] ? errMsg[0] : "Failed to post! Please try again later.",
        {
          position: "bottom-center",
        },
      );
    },
  });

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.imageUrl}
        alt="Profile Image"
        className="h-16 w-16 rounded-full"
        width={64}
        height={64}
        priority
      />
      <input
        type="text"
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        value={input}
        onChange={onChangeInput}
        disabled={onClickPost.isLoading}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              onClickPost.mutate({ content: input });
            }
          }
        }}
      />
      {input !== "" && !onClickPost.isLoading && (
        <button
          onClick={() => onClickPost.mutate({ content: input })}
          disabled={onClickPost.isLoading}
        >
          Post
        </button>
      )}
      {onClickPost.isLoading && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};
