# Blog Aggregator CLI

A command-line RSS feed aggregator that allows you to follow multiple blogs and view their latest posts in your terminal.

## Prerequisites

Before running the CLI, you'll need:

- **Node.js** (v18 or higher recommended)
- **PostgreSQL** database
- **npm** or **yarn** package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/gooneraki/blog-aggregator-ts.git
cd blog-aggregator-ts
```

2. Install dependencies:

```bash
npm install
```

## Configuration

### 1. Set up your configuration file

Create a file named `.gatorconfig-ts.json` in your home directory:

```bash
touch ~/.gatorconfig-ts.json
```

Add the following content (replace with your actual database URL):

```json
{
  "db_url": "postgres://username:password@localhost:5432/blog_aggregator",
  "current_user_name": ""
}
```

**Note:** The `current_user_name` will be automatically set when you register or login.

### 2. Run database migrations

Generate and apply the database schema:

```bash
npm run generate
npm run migrate
```

## Usage

Run commands using:

```bash
npm run start <command> [arguments]
```

### Available Commands

#### User Management

**Register a new user:**

```bash
npm run start register <username>
```

**Login as a user:**

```bash
npm run start login <username>
```

**List all users:**

```bash
npm run start users
```

#### Feed Management

**Add a new feed:**

```bash
npm run start addfeed <feed_name> <feed_url>
```

Example:

```bash
npm run start addfeed "Boot.dev Blog" https://blog.boot.dev/index.xml
```

**List all feeds:**

```bash
npm run start feeds
```

**Follow a feed:**

```bash
npm run start follow <feed_url>
```

**List feeds you're following:**

```bash
npm run start following
```

**Unfollow a feed:**

```bash
npm run start unfollow <feed_url>
```

#### Aggregating Posts

**Start the feed aggregator:**

```bash
npm run start agg <time_between_requests>
```

The aggregator will continuously fetch new posts from all feeds at the specified interval.

Time format examples:

- `1m` - every 1 minute
- `30s` - every 30 seconds
- `1h` - every 1 hour
- `500ms` - every 500 milliseconds

Example:

```bash
npm run start agg 1m
```

Press `Ctrl+C` to stop the aggregator.

#### Browsing Posts

**View latest posts from feeds you follow:**

```bash
npm run start browse [limit]
```

Examples:

```bash
npm run start browse      # Shows 2 posts (default)
npm run start browse 10   # Shows 10 posts
```

Posts are ordered by publication date, with the most recent first.

#### Database Reset

**Reset the entire database:**

```bash
npm run start reset
```

**Warning:** This will delete all users, feeds, follows, and posts!

## Example Workflow

Here's a typical workflow to get started:

```bash
# 1. Register a new user
npm run start register john

# 2. Add some feeds
npm run start addfeed "Boot.dev Blog" https://blog.boot.dev/index.xml
npm run start addfeed "wagslane blog" https://blog.wagslane.dev/index.xml

# 3. Follow the feeds
npm run start follow https://blog.boot.dev/index.xml
npm run start follow https://blog.wagslane.dev/index.xml

# 4. Start the aggregator to fetch posts
npm run start agg 1m

# 5. In another terminal, browse the posts
npm run start browse 5
```

## Development

**Start the application:**

```bash
npm run start <command>
```

**Generate database migrations:**

```bash
npm run generate
```

**Apply migrations:**

```bash
npm run migrate
```

## Technologies Used

- **TypeScript** - Type-safe JavaScript
- **tsx** - TypeScript execution engine
- **Drizzle ORM** - TypeScript SQL ORM
- **PostgreSQL** - Relational database
- **fast-xml-parser** - RSS feed parsing

## License

ISC
