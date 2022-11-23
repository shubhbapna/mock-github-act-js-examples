# Javascript Action

From the [action.yml](action.yml) file we can see that this action will take a single input - the name of the repository and execute the `index.js` file inside the `dist` directory. This `index.js` file is produced by compiling the [index.ts](index.ts). On running `index.ts` the `run` function is executed which fetches the full name of the repo name we gave as input to the action and prints it. It also sets the output to some custom data gotten from a 3rd party api.

## Testing Strategy

While testing we don't want to hit the actual github api or the 3rd party api because it might have strict rate limits or might return dynamic data which will change the result of our test each time we run it.
So, we are going to test this by running this custom action in a workflow inside a local git repository and mock the api calls during the workflow run.
Steps (refer to [action.test.ts](test/action.test.ts) for implementation):  
1. Create a workflow file that utilizes this action. Refer to [action-test.yml](test/action-test.yml)
2. Before running the test make sure to compile `index.ts` (handled by a pre script when using `npm test`)
3. Create a local git repository using `mock-github` and initialize it with action.yml, dist/index.js and the workflow file we created in step 1
4. Create `Moctokit` and `Mockapi` instances from `mock-github`. Set the schema for `Mockapi`
5. Use `act-js` to run the workflow inside the local git repository. Make sure to set the `mockApi` field and pass in the mocks using `Moctokit` and `Mockapi`. 

Note: Notice how we needed to set a proxy for `Octokit` but not `axios` in our `index.ts` file. Some clients respect the proxy env variable used by `act-js` to mock apis during workflow runs. For clients that don't respect these env variables, you can write a simple wrapper to use the proxy just like we did here.