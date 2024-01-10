import { type ResolvingMetadata, type Metadata } from "next";
import { PageLayout } from "~/app/_components/page-layout";
import PostView from "~/app/_components/post-view";
import { api } from "~/trpc/server";

type generateMetadataProps = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};
export async function generateMetadata(
  { params, searchParams }: generateMetadataProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const data = await api.post.getById.query({ postId: parseInt(params.id) });

  return {
    title: `${data.post.content} - @${data.author.username}`,
  };
}

const SinglePostPage = async ({ params }: { params: { id: string } }) => {
  console.log("post id: ", params.id);
  const data = await api.post.getById.query({ postId: parseInt(params.id) });

  if (!data.post) return <div>404 Post Not Found</div>;

  return (
    <>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export default SinglePostPage;
