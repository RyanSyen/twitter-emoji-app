"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import { api } from "~/trpc/react";
import { useUser } from "@clerk/nextjs";

export const CreatePostWizard = () => {
  //   const router = useRouter();
  const [input, setInput] = useState<string>("");
  const { user } = useUser();
  const ctx = api.useUtils();

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  const onClickPost = api.post.create.useMutation({
    onSuccess: () => {
      //   router.refresh();
      setInput("");
      void ctx.post.getAll.invalidate(); // invalidateQueries is used to invalidate and refetch queries in the cache
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
      />
      <button onClick={() => onClickPost.mutate({ content: input })}>
        Post
      </button>
    </div>
  );
};
