import { Mockapi, MockGithub, Moctokit } from "@kie/mock-github";
import { Act } from "@kie/act-js";
import path from "path";

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub({
    repo: {
      testJsAction: {
        files: [
          {
            src: path.join(__dirname, "action-test.yml"),
            dest: ".github/workflows/test.yml",
          },
          {
            src: path.resolve(__dirname, "..", "action.yml"),
            dest: "/action.yml",
          },
          {
            src: path.resolve(__dirname, "..", "dist", "index.js"),
            dest: "/dist/index.js",
          },
        ],
      },
    },
  });

  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test("test workflow", async () => {
  // define the custom api schema
  const mockapi = new Mockapi({
    customApi: {
      baseUrl: "http://some-custom-api",
      endpoints: {
        root: {
          search: {
            path: "/",
            method: "get",
            parameters: {
              query: ["search"],
              body: [],
              path: [],
            },
          },
        },
      },
    },
  });

  const moctokit = new Moctokit("http://api.github.com");

  const act = new Act(mockGithub.repo.getPath("testJsAction"));
  const result = await act.runEvent("push", {
    mockApi: [
      moctokit.rest.repos
        .get({
          owner: "kie",
          repo: /some.*/,
        })
        .setResponse({ status: 200, data: { full_name: "mocked_full_name" } }),
      mockapi.mock.customApi.root.search().setResponse({
        status: 200,
        data: { results: "mocked_search_results" },
      }),
    ],
  });

  //expect(result.length).toBe(3);
  expect(result).toStrictEqual([
    { name: "Main actions/checkout@v3", status: 0, output: "" },
    { name: "Main ./testJsAction", status: 0, output: "mocked_full_name" },
    {
      name: "Main Get the custom data",
      status: 0,
      output: "Custom data {results:mocked_search_results}",
    },
  ]);
});
