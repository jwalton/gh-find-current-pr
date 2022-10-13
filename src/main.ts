import * as core from '@actions/core';
import * as github from '@actions/github';

async function main() {
    const token = core.getInput('github-token', { required: false }) || process.env.GITHUB_TOKEN;
    const state = (core.getInput('state', { required: false }) || 'open').toLowerCase();
    const sha = core.getInput('sha', { required: true });

    if (!token) {
        throw new Error('No GITHUB_TOKEN found');
    }

    const octokit = github.getOctokit(token);
    const context = github.context;
    const result = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: sha,
    });

    const prs = result.data.filter((el) => state === 'all' || el.state === state);
    const pr =
        prs.find((el) => {
            return context.payload.ref === `refs/heads/${el.head.ref}`;
        }) || prs[0];

    core.info(`Setting output: draft: ${(pr && pr.draft) || ''}`);
    core.setOutput('draft', (pr && pr.draft) || '');
    core.info(`Setting output: pr: ${(pr && pr.number) || ''}`);
    core.setOutput('pr', (pr && pr.number) || '');
    core.info(`Setting output: number: ${(pr && pr.number) || ''}`);
    core.setOutput('number', (pr && pr.number) || '');
    core.info(`Setting output: title: ${(pr && pr.title) || ''}`);
    core.setOutput('title', (pr && pr.title) || '');
    core.setOutput('body', (pr && pr.body) || '');
}

main().catch((err) => core.setFailed(err.message));
