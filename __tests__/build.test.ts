import path from "path";
import fs from "fs/promises";
import { it, expect } from "bun:test";

it("Dist folder is available", async () => {
  const distFolder = path.resolve(process.cwd(), "dist");
  let distFolderExists = await fs.exists(distFolder);

  if (!distFolderExists) {
    Bun.spawnSync(["bun", "run", "build"], { cwd: process.cwd() });
    distFolderExists = await fs.exists(distFolder);
  }

  expect(distFolderExists).toBe(true);
});

it("Imported types are available", async () => {
  const { default: TinyBus } = await import("../dist");
  expect(TinyBus).toBeDefined();

  const tinyBus = new TinyBus({
    uniqueEvents: false,
    retryInterval: 100,
    context: {},
  });

  tinyBus.on<[{ test: true }]>("test::event", {
    onCallback: (_1, _2, ...args) => {
      expect(args).toEqual([{ test: true }]);
    },
  });

  tinyBus.emit("test::event", { test: true });
});
