import { type NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/app/_components/page-layout";

export const metadata = {
  title: "Post",
};

const SinglePostPage: NextPage = () => {
  return (
    <>
      <PageLayout>
        <div>Post View</div>
      </PageLayout>
    </>
  );
};

export default SinglePostPage;
