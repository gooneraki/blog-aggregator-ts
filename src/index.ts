import {
  CommandsRegistry,
  middlewareLoggedIn,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { handlerReset } from "./commands/reset";
import { handlerAgg } from "./commands/agg";
import { handlerLogin, handlerRegister, handlerUsers } from "./commands/users";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds";
import { handlerFollow, handlerListFeedFollows } from "./commands/feed-follows";

async function main() {
  // Create command registry
  const commandsRegistry: CommandsRegistry = {};

  // Register commands
  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);
  registerCommand(commandsRegistry, "reset", handlerReset);
  registerCommand(commandsRegistry, "users", handlerUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);
  registerCommand(
    commandsRegistry,
    "addfeed",
    middlewareLoggedIn(handlerAddFeed)
  );
  registerCommand(commandsRegistry, "feeds", handlerListFeeds);
  registerCommand(
    commandsRegistry,
    "follow",
    middlewareLoggedIn(handlerFollow)
  );
  registerCommand(
    commandsRegistry,
    "following",
    middlewareLoggedIn(handlerListFeedFollows)
  );

  // Get command-line arguments (skip first 2: node and script path)
  const args = process.argv.slice(2);

  // Check if at least one argument (command name) is provided
  if (args.length === 0) {
    console.error("Error: Not enough arguments provided");
    process.exit(1);
  }

  // Split into command name and arguments
  const [cmdName, ...cmdArgs] = args;

  // Run the command
  try {
    await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("An unknown error occurred");
    }
    process.exit(1);
  }

  process.exit(0);
}

main();
