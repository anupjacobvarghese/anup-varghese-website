const { spawn } = require("child_process");
const path = require("path");
const script = path.join(__dirname, "whiten_logos.mjs");
console.log("Running whiten_logos.mjs (includes Oxford fix)...");
const child = spawn(process.execPath, [script], {
  stdio: "inherit",
  cwd: path.join(__dirname, ".."),
});
child.on("exit", (code) => process.exit(code ?? 1));
