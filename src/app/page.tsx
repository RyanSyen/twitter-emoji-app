import {
  SignIn,
  SignInButton,
  UserButton,
  useUser,
  currentUser,
  SignOutButton,
  // useClerk,
} from "@clerk/nextjs";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";
import { type RouterOutputs } from "~/trpc/shared";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
dayjs.extend(relativeTime);

const CreatePostWizard = async () => {
  const user = await currentUser();

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
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["post"]["getAll"][number]; // this tells ts we want an element from the "getAll" mtd
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`@${author.username}'s profile picture`}
        className="h-16 w-16 rounded-full"
        width={64}
        height={64}
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300">
          <span>{`@${author.username}`}</span>
          <span className="font-thin">{` · ${dayjs(
            post.createdAt,
          ).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

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
  // const allPosts = await api.post.getAll.query();

  // const hello = await api.test.hello.query({ text: "from test router tRPC" });

  const user = await currentUser();

  return (
    <main className="flex h-screen justify-center">
      <div className="w-full border-x border-slate-400 md:max-w-2xl">
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
        <Feed />
      </div>
    </main>
  );
}
