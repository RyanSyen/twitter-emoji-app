import { SignInButton, currentUser, SignOutButton } from "@clerk/nextjs";

import { api } from "~/trpc/server";
import { CreatePostWizard } from "./_components/create-post";
import { PageLayout } from "./_components/page-layout";
import PostView from "./_components/post-view";
import { Suspense } from "react";
import { LoadingSpinner } from "./_components/loading";

const Feed = async () => {
  const posts = await api.post.getAll.query();

  if (!posts) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {posts?.map((postList) => {
        return <PostView key={postList.post.id} {...postList} />;
      })}
    </div>
  );
};

export default async function Home() {
  const user = await currentUser();

  return (
    <PageLayout>
      <div className="flex border-b border-b-slate-400 p-4">
        {!user && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        {!!user && (
          <div className="flex w-full justify-between">
            {/* <CrudShowcase /> */}
            <CreatePostWizard />
            <div className="flex w-24 justify-center align-middle">
              <SignOutButton />
            </div>
          </div>
        )}
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <Feed />
      </Suspense>
    </PageLayout>
  );
}
