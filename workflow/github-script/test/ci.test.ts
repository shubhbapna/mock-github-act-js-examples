import { Act } from "@kie/act-js";
import { MockGithub, Moctokit } from "@kie/mock-github";
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
          },
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
  const moctokit = new Moctokit("http://api.github.com");
  const act = new Act(github.repo.getPath("mockApi"));
  const result = await act
    .setEnv("GITHUB_REPOSITORY", "kiegroup/mock-github")
    .setEnv("GITHUB_API_URL", "http://api.github.com")
    .runEvent("push", {
      logFile: process.env.ACT_LOG ? "mock-api.log" : undefined,
      mockApi: [
        moctokit.rest.repos.get().setResponse({
          status: 200,
          data: { full_name: "it definitely worked" },
        }),
      ],
    });

  expect(result).toStrictEqual([
    {
      name: "Main octokit-script-without-query",
      status: 0,
      output: "it definitely worked",
    },
  ]);
});
