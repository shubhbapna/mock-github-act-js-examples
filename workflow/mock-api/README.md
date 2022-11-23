# Simple workflow file

This directory contains a simple workflow that uses curl to make an "api" call

## Testing Strategy

Sometimes our api's might have strict rate limits or might return dynamically data. To avoid all this we will mock this api call
Steps (refer to [action.test.ts](test/ci.test.ts) for implementation):  
1. Create a local git repository using `mock-github` and initialize it whatever files we need along with `.github` directory
2. Use `act-js` to run the workflow inside the local git repository and compare expected output. Make sure to mock the api