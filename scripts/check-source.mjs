import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const sourceRoots = [
  "app",
  "build",
  "components",
  "db",
  "lib",
  "theme",
  "worker",
];
const checkedExtensions = new Set([".css", ".ts", ".tsx"]);
const viewportUnitPattern = /(?:^|[^A-Za-z0-9_])(?:\d+(?:\.\d+)?|\.\d+)(?:d?vh|d?vw)\b/i;
const browserStoragePattern = /\b(?:localStorage|sessionStorage)\b/;

async function collectFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return [];
  }

  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        return collectFiles(path);
      }
      return checkedExtensions.has(extname(entry.name)) ? [path] : [];
    }),
  );

  return nestedFiles.flat();
}

function isCountedLine(line) {
  const trimmed = line.trim();
  return (
    trimmed.length > 0 &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("/*") &&
    !trimmed.startsWith("*") &&
    !trimmed.startsWith("*/")
  );
}

const files = (await Promise.all(sourceRoots.map(collectFiles))).flat();
const violations = [];

for (const file of files) {
  const source = await readFile(file, "utf8");
  const lines = source.split(/\r?\n/);
  const significantLineCount = lines.filter(isCountedLine).length;

  if (significantLineCount > 400) {
    violations.push(`${file}: ${significantLineCount} significant lines (max 400)`);
  }

  lines.forEach((line, index) => {
    if (viewportUnitPattern.test(line)) {
      violations.push(`${file}:${index + 1}: viewport sizing unit is prohibited`);
    }
    if (browserStoragePattern.test(line)) {
      violations.push(`${file}:${index + 1}: browser storage is prohibited`);
    }
  });
}

if (violations.length > 0) {
  process.stderr.write(`${violations.join("\n")}\n`);
  process.exitCode = 1;
}
