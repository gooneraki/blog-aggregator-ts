import { desc, eq, sql } from "drizzle-orm";
import { db } from "..";
import { posts, feedFollows } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createPost(
  title: string,
  url: string,
  description: string | null,
  publishedAt: Date | null,
  feedId: string
) {
  const [result] = await db
    .insert(posts)
    .values({ title, url, description, publishedAt, feedId })
    .returning();
  return result;
}

export async function getPostByURL(url: string) {
  const result = await db.select().from(posts).where(eq(posts.url, url));
  return firstOrUndefined(result);
}

export async function getPostsForUser(userId: string, limit: number = 2) {
  const result = await db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

  return result;
}
