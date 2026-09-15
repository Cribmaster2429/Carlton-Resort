// Runs Vite and the API together. Exits only after both children have, so Ctrl+C returns a clean prompt.
import { spawn } from "node:child_process";

const web = ["client/node_modules/vite/bin/vite.js", "--config", "client/vite.config.js"];
if (process.env.WEB_PORT) web.push("--port", process.env.WEB_PORT, "--no-open");
const api = ["--watch", "--no-warnings=ExperimentalWarning", "--env-file-if-exists=server/.env", "server/src/index.js"];

const children = [web, api].map((args) => spawn(process.execPath, args, { stdio: "inherit" }));
let alive = children.length;

const stopAll = () => children.forEach((child) => child.exitCode === null && child.kill());

for (const child of children) {
  child.on("exit", (code) => {
    if (code && !process.exitCode) process.exitCode = code;
    if (--alive === 0) process.exit();
    stopAll();
  });
}

process.on("SIGINT", stopAll);
process.on("SIGTERM", stopAll);
