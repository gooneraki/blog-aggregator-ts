import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { handlerLogin } from "./commands/users";

function main() {
  // Create command registry
  const commandsRegistry: CommandsRegistry = {};

  // Register commands
  registerCommand(commandsRegistry, "login", handlerLogin);

  // Get command-line arguments (skip first 2: node and script path)
  const args = process.argv.slice(2);

  // Check if at least one argument (command name) is provided
  if (args.length === 0) {
    console.error("Error: Not enough arguments provided");
    process.exit(1);
  }

  // Split into command name and arguments
  const [cmdName, ...cmdArgs] = args;

  try {
    // Run the command
    runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("An unknown error occurred");
    }
    process.exit(1);
  }
}

main();
