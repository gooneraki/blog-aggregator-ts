import { readConfig, setUser } from "./config";
function main() {
  setUser("gooneraki");
  const cfg = readConfig();
  console.log(cfg);
}

main();
