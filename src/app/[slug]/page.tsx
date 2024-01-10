import { currentUser } from "@clerk/nextjs/server";
import { type ResolvingMetadata, type NextPage, type Metadata } from "next";
import Head from "next/head";
import { api } from "~/trpc/server";
import { PageLayout } from "../_components/layout";
import Image from "next/image";

// export const metadata = {
//   title: "Profile",
// };
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

const ProfilePage = async ({ params }: { params: { slug: string } }) => {
  const user = await currentUser();
  //   const { data, isLoading } = api.profile.getUserByUsername.useQuery({
  //     username: !user?.username
  //       ? `${user?.firstName}${user?.lastName}`
  //       : user.username,
  //   });

  console.log("params: ", params.slug);

  const data = await api.profile.getUserByUsername.query({
    // username: !user?.username
    //   ? `${user?.firstName}${user?.lastName}`
    //   : user.username,
    // username: "ryansyen",
    userid: params.slug,
  });

  if (!data) return <div>404</div>;

  console.log(data);

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
            className="absolute bottom-0 -mb-[64px] ml-4 rounded-full border-4 border-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold text-gray-200">
          {data.username}
        </div>
        <div className="w-full border-b border-slate-400" />
      </PageLayout>
    </>
  );
};

export default ProfilePage;
