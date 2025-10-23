import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, userId })
    .returning();
  return result;
}

export async function getFeeds() {
  return await db.select().from(feeds);
}

export async function getFeedById(id: string) {
  const result = await db.select().from(feeds).where(eq(feeds.id, id));
  return firstOrUndefined(result);
}

export async function getFeedByURL(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}
