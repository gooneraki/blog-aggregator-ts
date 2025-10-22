import { getUser } from "../lib/db/queries/users";
import { readConfig } from "../config";
import { createFeed } from "../lib/db/queries/feeds";
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

function printFeed(feed: Feed, user: User) {
  console.log(feed);
  console.log(user);
}
