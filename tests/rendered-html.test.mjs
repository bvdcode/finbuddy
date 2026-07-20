import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("ships the FinBuddy product shell and metadata", async () => {
  const [page, layout, packageJson, resources] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../lib/i18n/resources.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /FinanceApp/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /\/og\.png/);
  assert.match(resources, /Пульс денег/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("public/og.png", projectRoot));
  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
});
