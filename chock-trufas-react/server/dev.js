import { spawn } from "node:child_process";

const apiHealthUrl = "http://127.0.0.1:3001/api/health";
const processes = [];

async function apiIsRunning() {
  try {
    const response = await fetch(apiHealthUrl);
    const data = await response.json();

    return response.ok && data.service === "chock-trufas-api";
  } catch {
    return false;
  }
}

function startProcess(command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  processes.push(child);

  child.on("exit", (code) => {
    if (code && code !== 0) {
      stopProcesses();
      process.exit(code);
    }
  });

  return child;
}

function stopProcesses() {
  processes.forEach((child) => {
    if (!child.killed) {
      child.kill();
    }
  });
}

async function startDev() {
  if (await apiIsRunning()) {
    console.log("Chock Trufas API ja esta rodando em http://127.0.0.1:3001");
  } else {
    startProcess("node", ["server/server.js"]);
  }

  startProcess("npx", ["vite"]);
}

process.on("SIGINT", () => {
  stopProcesses();
  process.exit(0);
});

process.on("SIGTERM", () => {
  stopProcesses();
  process.exit(0);
});

startDev();
