import type { User } from "@clerk/nextjs/api";

export const filterUser = (user: User) => {
  const username = !user.username
    ? `${user.firstName} ${user.lastName}`
    : user.username;
  return {
    id: user.id,
    username,
    profileImageUrl: user.imageUrl,
  };
};
