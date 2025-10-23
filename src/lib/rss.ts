import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
      accept: "application/rss+xml",
    },
  });
  if (!response.ok) {
    throw new Error(
      `failed to fetch feed: ${response.status} ${response.statusText}`
    );
  }

  const XMLdata = await response.text();
  const parser = new XMLParser();
  const parsedData = parser.parse(XMLdata);

  const jObj: RSSFeed = parsedData.rss;

  if (typeof jObj !== "object" || !jObj.channel) {
    throw new Error(
      `feed aint an object or does not contain channel ${JSON.stringify(jObj)}`
    );
  }

  const { title, link, description } = jObj.channel;
  if (!title || !link || !description) {
    throw new Error(
      `channel does not contain all metadata ${JSON.stringify({
        title,
        link,
        description,
      })}`
    );
  }

  const item = jObj.channel.item ?? [];
  if (!Array.isArray(item)) {
    throw new Error(`item aint an array ${JSON.stringify(item)}`);
  }

  let adjItems: RSSItem[] = [];
  item.forEach((i) => {
    const { title, link, description, pubDate } = i;
    if (title && link && description && pubDate) {
      adjItems.push(i);
    }
  });

  return {
    channel: {
      description,
      link,
      title,
      item: adjItems,
    },
  };
}

export function parsePublishedDate(pubDate: string): Date | null {
  try {
    const date = new Date(pubDate);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch {
    return null;
  }
}
