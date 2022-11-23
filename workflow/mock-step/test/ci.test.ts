import { Act } from "@kie/act-js";
import { MockGithub } from "@kie/mock-github";
import path from "path";

let github: MockGithub;
beforeEach(async () => {
  github = new MockGithub({
    repo: {
      mockStep: {
        files: [
          {
            src: path.resolve(__dirname, "..", ".github"),
            dest: ".github",
          },
          {
            src: path.resolve(__dirname, "..", "package.json"),
            dest: "package.json",
          },
          {
            src: path.resolve(__dirname, "..", "package-lock.json"),
            dest: "package-lock.json",
          },
          {
            src: path.resolve(__dirname, "..", "tsconfig.json"),
            dest: "tsconfig.json",
          },
          {
            src: path.resolve(__dirname, "..", "test"),
            dest: "test",
          },
          {
            src: path.resolve(__dirname, "..", "jest.config.ts"),
            dest: "jest.config.ts",
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

test("publish workflow", async () => {
  const act = new Act(github.repo.getPath("mockStep"));
  const result = await act.setSecret("NPM_TOKEN", "fake_token").runEvent("workflow_dispatch", {
    mockSteps: {
      build: [
        {
          run: "npm publish --access public",
          mockWith:
            "echo Making sure that npm token is set - $NODE_AUTH_TOKEN",
        },
      ],
    },
  });

  expect(result).toMatchObject([
    {
      name: "Main actions/checkout@v3",
      status: 0,
      output: "",
    },
    {
      name: "Main actions/setup-node@v3",
      output: expect.any(String),
      status: 0,
    },
    {
      name: "Main npm install",
      status: 0,
      output: expect.any(String),
    },
    {
      name: "Main npm run build",
      status: 0,
      output: expect.stringMatching(/echo build/),
    },
    {
      name: "Main echo Making sure that npm token is set - $NODE_AUTH_TOKEN",
      status: 0,
      output: "Making sure that npm token is set - ***",
    },
    {
      name: "Post actions/setup-node@v3",
      output: "",
      status: 0,
    },
  ]);
});
