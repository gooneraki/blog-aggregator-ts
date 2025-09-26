import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(user: string) {
  const config = readConfig();
  config.currentUserName = user;
  writeConfig(config);
}

export function readConfig(): Config {
  const filepath = getConfigFilePath();
  const fileContent = fs.readFileSync(filepath, "utf8");
  const rawConfig = JSON.parse(fileContent);
  return validateConfig(rawConfig);
}

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  const filepath = getConfigFilePath();
  // Convert camelCase back to snake_case for JSON
  const jsonData = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  const jsonString = JSON.stringify(jsonData);
  fs.writeFileSync(filepath, jsonString);
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig || typeof rawConfig !== "object") {
    throw new Error("Config file is invalid: must contain a JSON object");
  }

  if (typeof rawConfig.db_url !== "string") {
    throw new Error("Config file is invalid: db_url must be a string");
  }

  // Handle the case where current_user_name might not exist yet
  const currentUserName = rawConfig.current_user_name || "";

  return {
    dbUrl: rawConfig.db_url, // Convert snake_case to camelCase
    currentUserName: currentUserName,
  };
}
