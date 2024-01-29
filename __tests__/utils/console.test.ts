import { expect, it } from "bun:test";

import { c } from "utils/console";

it("Returns correct the text with color", () => {
  const text = "test";
  const red = `\x1b[31m${text}\x1b[0m`;
  const green = `\x1b[32m${text}\x1b[0m`;
  const yellow = `\x1b[33m${text}\x1b[0m`;
  const blue = `\x1b[34m${text}\x1b[0m`;
  const magenta = `\x1b[35m${text}\x1b[0m`;
  const cyan = `\x1b[36m${text}\x1b[0m`;
  const white = `\x1b[37m${text}\x1b[0m`;
  const gray = `\x1b[90m${text}\x1b[0m`;
  expect(c(text, "red")).toBe(red);
  expect(c(text, "green")).toBe(green);
  expect(c(text, "yellow")).toBe(yellow);
  expect(c(text, "blue")).toBe(blue);
  expect(c(text, "magenta")).toBe(magenta);
  expect(c(text, "cyan")).toBe(cyan);
  expect(c(text, "white")).toBe(white);
  expect(c(text, "gray")).toBe(gray);
});
