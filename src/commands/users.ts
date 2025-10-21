import { createUser, getUser, getUsers } from "../lib/db/queries/users";
import { readConfig, setUser } from "../config";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const username = args[0];
  const user = await getUser(username);
  if (!user) {
    throw new Error(`couldnt get user ${username}`);
  }

  setUser(username);
  console.log("User switched successfully!");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const user = await createUser(userName);
  if (!user) {
    throw new Error("couldnt create user");
  }

  setUser(userName);
  console.log(`User ${userName} created successfully!`);
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  const currentUser = readConfig().currentUserName;

  const users = await getUsers();
  users.forEach((user) => {
    console.log(
      `* ${user.name}${user.name === currentUser ? " (current)" : ""}`
    );
  });
}
