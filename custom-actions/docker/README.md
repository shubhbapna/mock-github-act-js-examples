# Docker Action

This is a simple docker action taken from the [Github docs](https://docs.github.com/en/actions/creating-actions/creating-a-docker-container-action#creating-an-action-metadata-file). You can take a look at what it does in [action.yml](action.yml)

## Running tests

Without log file

```
npm test
```

With log file

```
ACT_LOG=true npm test
```
The above produces a log file called `docker.log`

## Testing Strategy

We are going to test this by running this custom action in a workflow inside a local git repository.  
Steps (refer to [action.test.ts](test/action.test.ts) for implementation):  
1. Create a workflow file that utilizes this action. Refer to [action-test.yml](test/action-test.yml)
2. Create a local git repository using `mock-github` and initialize it with action.yml, Dockerfile, entrypoint.sh and the workflow file we created in step 1
3. Use `act-js` to run the workflow inside the local git repository and compare expected output