# Simple workflow file

This directory contains a simple workflow that checks out the directory and runs some commands

## Running tests

Without log file

```
npm test
```

With log file

```
ACT_LOG=true npm test
```
The above produces a log file called `simple.log`

## Testing Strategy

We are going to test this by running this workflow in a clean, safe local git repository
Steps (refer to [action.test.ts](test/ci.test.ts) for implementation):  
1. Create a local git repository using `mock-github` and initialize it whatever files we need along with `.github` directory
2. Use `act-js` to run the workflow inside the local git repository and compare expected output