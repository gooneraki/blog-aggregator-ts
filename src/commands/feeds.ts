import { getUser, getUserById } from "../lib/db/queries/users";
import { readConfig } from "../config";
import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { Feed, User } from "../lib/db/schema";

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

  printFeed(feed, user);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  const feeds = await getFeeds();

  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    if (!user) {
      throw new Error(`couldnt get user of feed ${feed.userId}`);
    }

    printFeed(feed, user);
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
