import { UserCommandHandler } from "./commands";
import { getPostsForUser } from "../lib/db/queries/posts";

export const handlerBrowse: UserCommandHandler = async (
  cmdName: string,
  user,
  ...args: string[]
) => {
  let limit = 2;

  if (args.length > 0) {
    const parsedLimit = parseInt(args[0], 10);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      throw new Error(`Invalid limit: ${args[0]}`);
    }
    limit = parsedLimit;
  }

  const posts = await getPostsForUser(user.id, limit);

  if (posts.length === 0) {
    console.log("No posts found");
    return;
  }

  console.log(`Found ${posts.length} posts for user ${user.name}:`);
  for (const post of posts) {
    console.log(`
Title: ${post.title}
URL: ${post.url}
Description: ${post.description || "N/A"}
Published: ${post.publishedAt ? post.publishedAt.toISOString() : "N/A"}
`);
  }
};
