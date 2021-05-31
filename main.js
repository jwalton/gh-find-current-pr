const core = require('@actions/core');
const github = require('@actions/github');

async function main() {
    const token = core.getInput('github-token', { required: false }) || process.env.GITHUB_TOKEN;
    const sha = core.getInput('sha', { required: true});

    const octokit = github.getOctokit(token)
    const context = github.context;
    const result = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: sha,
    });

    const pr = result.data.length > 0 && result.data.filter(el => el.state === 'open')[0];

    core.setOutput('pr', pr && pr.number || '');
    core.setOutput('number', pr && pr.number || '');
    core.setOutput('title', pr && pr.title || '');
    core.setOutput('body', pr && pr.body || '');
}

main().catch(err => core.setFailed(err.message));
