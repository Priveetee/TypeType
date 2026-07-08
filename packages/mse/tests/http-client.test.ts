import { expect, test } from "bun:test";
import { HttpClient } from "../src/http-client";

test("preserves endpoint path for absolute API URLs", () => {
  const http = new HttpClient({ endpoint: "https://beta.typetype.video/api" });
  expect(http.absolute("/sabr/playback/session/manifest")).toBe(
    "https://beta.typetype.video/api/sabr/playback/session/manifest",
  );
});
