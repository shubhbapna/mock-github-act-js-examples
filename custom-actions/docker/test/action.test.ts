import { MockGithub } from "@kie/mock-github";
import { Act } from "@kie/act-js";
import path from "path";

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub({
    repo: {
      testDockerAction: {
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
            src: path.resolve(__dirname, "..", "Dockerfile"),
            dest: "/Dockerfile",
          },
          {
            src: path.resolve(__dirname, "..", "entrypoint.sh"),
            dest: "/entrypoint.sh",
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
  const act = new Act(mockGithub.repo.getPath("testDockerAction"));
  const result = await act.runEvent("push", {logFile: process.env.ACT_LOG ? "docker.log" : undefined});

  expect(result.length).toBe(3);
  expect(result).toMatchObject([
    { name: "Main actions/checkout@v3", status: 0, output: "" },
    {
      name: "Main ./testDockerAction",
      status: 0,
      output: "Hello Mona the Octocat",
    },
    {
      name: "Main Get the output time",
      status: 0,
      output: expect.stringMatching(/The time was .*/),
    }
  ]);
});
