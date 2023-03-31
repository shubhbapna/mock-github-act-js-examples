# Simple workflow file

This directory contains a simple workflow that used to publish an npm package

## Running tests

Without log file

```
npm test
```

With log file

```
ACT_LOG=true npm test
```
The above produces a log file called `mock-step.log`

## Testing Strategy

Clearly we don't want to actually publish our npm package when testing our workflow. In this case we will mock the step to avoid running `npm publish`
Steps (refer to [action.test.ts](test/ci.test.ts) for implementation):  
1. Create a local git repository using `mock-github` and initialize it whatever files we need along with `.github` directory
2. Use `act-js` to run the workflow inside the local git repository and compare expected output. Make sure to mock the last step.