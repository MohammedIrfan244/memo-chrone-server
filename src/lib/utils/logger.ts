export function logInfo(message: string) {
  if (process.env.ENVIRONMENT === "development") {
    console.log("\x1b[34m%s\x1b[0m", `[INFO] ${message}`);
  }
  return;
}

export function logError(message: string) {
  if (process.env.ENVIRONMENT === "development") {
    console.log("\x1b[31m%s\x1b[0m", `[ERROR] ${message}`);
  }
  return;
}
