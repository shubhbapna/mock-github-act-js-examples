# Workflow with @actions/github-script

This directory contains a simple workflow that uses `@actions/github-script`

## Running tests

Without log file

```
npm test
```

With log file

```
ACT_LOG=true npm test
```
The above produces a log file called `mock-api.log`

## Testing Strategy


1. Create a local git repository using `mock-github` and initialize it whatever files we need along with `.github` directory
2. Notice that `@actions/github-script` allows us to control the base url of the GitHub API by using the env variable `GITHUB_API_URL`
3. We will use `setEnv("GITHUB_API_URL", "http://api.github.com")` to downgrade the GitHub API base url to HTTP since HTTPS requests cannot be mocked.
4. Use `act-js` to run the workflow inside the local git repository and compare expected output. Make sure to mock the api using `Moctokit` by setting the base url for `Moctokit` to "http://api.github.com".