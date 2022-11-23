import { MockGithub } from "@kie/mock-github";
import { Act } from "@kie/act-js";
import path from "path";

let mockGithub: MockGithub;
beforeEach(async () => {
  mockGithub = new MockGithub({
    repo: {
      testCompositeAction: {
        files: [
          {
            src: path.join(__dirname, "action-test.yml"),
            dest: ".github/workflows/test.yml",
          },
          {
            src: path.resolve(__dirname, "..", "action.yml"),
            dest: "/action.yml",
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
  const act = new Act(mockGithub.repo.getPath("testCompositeAction"));
  const result = await act.runEvent("push");

  expect(result.length).toBe(7);
  expect(result).toMatchObject([
    { name: "Main actions/checkout@v3", status: 0, output: "" },
    { name: "Main ./testCompositeAction", status: 0, output: "" },
    {
      name: "Main echo Hello ${{ inputs.who-to-greet }}.",
      status: 0,
      output: "Hello Mona the Octocat.",
    },
    {
      name: 'Main echo "::set-output name=random-number::$(echo $RANDOM)"',
      status: 0,
      output: "",
    },
    {
      name: 'Main echo "${{ github.action_path }}" >> $GITHUB_PATH',
      status: 0,
      output: "",
    },
    {
      name: "Main echo random-number ${{ steps.foo.outputs.random-number }}",
      status: 0,
      output: expect.stringMatching(/random-number \d*/),
    },
    {
      name: "Post ./testCompositeAction",
      status: 0,
      output: "",
    },
  ]);
});
