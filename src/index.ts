import { setUser, readConfig } from "./config";

function main() {
  setUser("gooneraki");
  const config = readConfig();
  console.log("Config contents:", config);
}

main();
