# gh-find-current-pr

This action tries to figure out the current PR.

If the event is a `pull_request`, it's very easy to get the current PR number
from the context via `${{ github.event.number }}`, but unfortunately this
information does not seem to be readily available for a `push` event.  This
action sends a request to GitHub to find the PR associated with the current SHA,
and returns it in the `pr` output.  `pr` will be an empty string if there is no
PR.

## Usage

```yaml
    steps:
      - uses: actions/checkout@v1
      # Find the PR associated with this push, if there is one.
      - uses: jwalton/gh-find-current-pr@v1
        id: findPr
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
      # This will echo "Your PR is 7", or be skipped if there is no current PR.
      - run: echo "Your PR is ${PR}"
        if: success() && steps.findPr.outputs.pr
        env:
          PR: ${{ steps.findPr.outputs.pr }}
```
