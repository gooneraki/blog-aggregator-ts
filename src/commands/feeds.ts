import { getUser, getUserById } from "../lib/db/queries/users";
import { readConfig } from "../config";
import {
  createFeed,
  getFeedById,
  getFeedByUrl,
  getFeeds,
} from "../lib/db/queries/feeds";
import { Feed, User } from "../lib/db/schema";
import {
  createFeedFollows,
  getFeedFollowsByUserId,
} from "../lib/db/queries/feed-follows";

export async function handlerAddfeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
  }

  const username = readConfig().currentUserName;
  const user = await getUser(username);
  if (!user) {
    throw new Error(`couldnt get user ${username}`);
  }

  const name = args[0];
  const url = args[1];
  const feed = await createFeed(name, url, user.id);
  if (!feed) {
    throw new Error(`couldnt create feed ${name}`);
  }

  // Automatically create a feed follow for the user
  await createFeedFollow(feed.id, user.id);
}

export async function handlerListFeeds(_: string) {
  const feeds = await getFeeds();

  if (feeds.length === 0) {
    console.log(`No feeds found.`);
    return;
  }

  console.log(`Found %d feeds:\n`, feeds.length);
  for (let feed of feeds) {
    const user = await getUserById(feed.userId);
    if (!user) {
      throw new Error(`Failed to find user for feed ${feed.id}`);
    }

    printFeed(feed, user);
    console.log(`=====================================`);
  }
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

async function createFeedFollow(feedId: string, userId: string) {
  const feedFollow = await createFeedFollows(feedId, userId);
  if (!feedFollow) {
    throw new Error("couldnt create feed-follow");
  }

  console.log(`* Feed:          ${feedFollow.feedName}`);
  console.log(`* User:          ${feedFollow.userName}`);
}

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const url = args[0];

  const username = readConfig().currentUserName;
  const user = await getUser(username);
  if (!user) {
    throw new Error(`couldnt get user ${username}`);
  }

  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`couldnt get feed ${url}`);
  }

  await createFeedFollow(feed.id, user.id);
}

export async function handlerFollowing(_: string) {
  const username = readConfig().currentUserName;
  const user = await getUser(username);
  if (!user) {
    throw new Error(`couldnt get user ${username}`);
  }

  const feedFollows = await getFeedFollowsByUserId(user.id);

  if (feedFollows.length === 0) {
    console.log(`No feeds followed.`);
    return;
  }

  console.log(`User ${user.name} is following:\n`);
  for (const feedFollow of feedFollows) {
    console.log(`* ${feedFollow.feedName}`);
  }
}

async function getFeedFollowsForUser(userId: string) {
  const feedFollows = await getFeedFollowsByUserId(userId);
}
