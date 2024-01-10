import { type ResolvingMetadata, type Metadata } from "next";
import Head from "next/head";
import { api } from "~/trpc/server";
import { PageLayout } from "../_components/page-layout";
import Image from "next/image";
import PostView from "../_components/post-view";
import { Suspense } from "react";
import { LoadingSpinner } from "../_components/loading";

type generateMetadataProps = {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
};
export async function generateMetadata(
  { params, searchParams }: generateMetadataProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const data = await api.profile.getUserByUsername.query({
    userid: params.slug,
  });

  return {
    title: data.username,
  };
}

const ProfileFeed = async ({ userId }: { userId: string }) => {
  const posts = await api.post.getByUserId.query({ userId });

  if (!posts || posts.length === 0) return <div>User has not posted</div>;

  return (
    <div className="flex flex-col">
      {posts.map((data) => {
        return <PostView key={data.post.id} {...data} />;
      })}
    </div>
  );
};

const ProfilePage = async ({ params }: { params: { slug: string } }) => {
  const data = await api.profile.getUserByUsername.query({
    userid: params.slug,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-48 border-slate-400 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username}'s profile picture`}
            width={128}
            height={128}
            className="absolute bottom-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold text-gray-200">
          {data.username}
        </div>
        <div className="w-full border-b border-slate-400" />
        <Suspense fallback={<LoadingSpinner />}>
          <ProfileFeed userId={params.slug} />
        </Suspense>
      </PageLayout>
    </>
  );
};

export default ProfilePage;
