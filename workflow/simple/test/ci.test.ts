import { MockGithub } from "@kie/mock-github";
import { Act } from "@kie/act-js";
import path from "path";

let mockGithub: MockGithub;

beforeEach(async () => {
  // create a local repo
  mockGithub = new MockGithub({
    repo: {
      testRepo: {
        files: [
          {
            src: path.resolve(__dirname, "..", ".github"),
            dest: ".github",
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
  const act = new Act(mockGithub.repo.getPath("testRepo"));
  const result = await act.runEvent("pull_request", {logFile: process.env.ACT_LOG ? "simple.log" : undefined});

  expect(result).toStrictEqual([
    { name: "Main actions/checkout@v2", status: 0, output: "" },
    { name: "Main do something", status: 0, output: "step 1\nstep 2" },
  ]);
});
