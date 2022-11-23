import * as core from "@actions/core";
import { Octokit } from "@octokit/rest";
import axios from "axios";
import { HttpProxyAgent } from "http-proxy-agent";

async function run() {
  try {
    const proxy = process.env["http_proxy"];
    const octokit = new Octokit({
      request: { agent: proxy ? new HttpProxyAgent(proxy) : undefined },
    });
    const repo = core.getInput("repo");
    const repoData = await octokit.rest.repos.get({
      owner: "kie",
      repo,
    });
    console.log(repoData.data.full_name);

    const customData = await axios.get("http://some-custom-api/?search=test");
    core.setOutput("customData", JSON.stringify(customData.data));
  } catch (error) {
    console.log(error);
    core.setFailed("Something went wrong");
  }
}

run();
