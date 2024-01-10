import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs } from "~/trpc/shared";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

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
          <Link href={`/${author.id}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(
              post.createdAt,
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

export default PostView;
