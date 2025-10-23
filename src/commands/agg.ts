import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import { createPost, getPostByURL } from "../lib/db/queries/posts";
import { fetchFeed, parsePublishedDate } from "../lib/rss";
import { Feed } from "../lib/db/schema";
import { parseDuration } from "../lib/time";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }

  const timeArg = args[0];
  const timeBetweenRequests = parseDuration(timeArg);
  if (!timeBetweenRequests) {
    throw new Error(
      `invalid duration: ${timeArg} — use format 1h 30m 15s or 3500ms`
    );
  }

  console.log(`Collecting feeds every ${timeArg}...`);

  // run the first scrape immediately
  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log(`No feeds to fetch.`);
    return;
  }
  console.log(`Found a feed to fetch!`);
  scrapeFeed(feed);
}

async function scrapeFeed(feed: Feed) {
  await markFeedFetched(feed.id);

  const feedData = await fetchFeed(feed.url);

  console.log(
    `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`
  );

  for (const item of feedData.channel.item) {
    const existingPost = await getPostByURL(item.link);
    if (existingPost) {
      continue;
    }

    const publishedAt = parsePublishedDate(item.pubDate);
    await createPost(
      item.title,
      item.link,
      item.description || null,
      publishedAt,
      feed.id
    );
  }
}

function handleError(err: unknown) {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`
  );
}
