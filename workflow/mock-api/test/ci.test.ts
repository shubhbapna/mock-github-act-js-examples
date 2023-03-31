import { Act, Mockapi } from "@kie/act-js";
import { MockGithub } from "@kie/mock-github";
import path from "path";

let github: MockGithub;
beforeEach(async () => {
  github = new MockGithub({
    repo: {
      mockApi: {
        files: [
          {
            src: path.resolve(__dirname, "..", ".github"),
            dest: ".github",
          }
        ],
      },
    },
  });
  await github.setup();
});

afterEach(async () => {
  await github.teardown();
});

test("api workflow", async () => {
  const mockapi = new Mockapi({
    google: {
      baseUrl: "http://google.com",
      endpoints: {
        root: {
          get: {
            path: "/",
            method: "get",
            parameters: {
              query: [],
              path: [],
              body: [],
            },
          },
        },
      },
    },
  });


  const act = new Act(github.repo.getPath("mockApi"));
  const result = await act.runEvent("push", {
    logFile: process.env.ACT_LOG ? "mock-api.log" : undefined,
    mockApi: [
      mockapi.mock.google.root
        .get()
        .setResponse({ status: 200, data: "mock response" }),
    ],
  });

  expect(result).toMatchObject([
    {
      name: "Main actions/checkout@v3",
      status: 0,
      output: "",
    },
    {
      name: "Main api call",
      status: 0,
      output: "mock response",
    }
  ]);
});
