---
name: comment-on-github
description: Use when posting a comment on a GitHub pull request or issue, including review comments and thread replies.
metadata:
  reference:
    - "https://github.com/t3dotgg/tstack/blob/main/skills/leaving-pr-comments/SKILL.md"
---

# Comment on GitHub

## Write the comment

For each comment you write on the user's behalf, start with this GitHub note callout:

```md
> [!NOTE]
> 🤖 **<model> (on behalf of <user>)**

Actual comment starts here.
```

Use the verified public name of the model that wrote the comment and the user's name or GitHub login.

If the model name is unavailable, use the harness name.

Keep the attribution inside the note and the comment outside it. Put a blank line after the callout so the comment does not join the blockquote. Start the attribution line with the robot emoji. Do not add a horizontal rule, Setext underline, heading, signature footer, or second attribution.

Apply this format to issue comments, top-level PR comments, inline review comments, replies to bots or reviewers, and explanations posted before you resolve or dismiss feedback. Leave issue descriptions, PR descriptions, commit messages, and text the user explicitly asks to post verbatim without attribution unchanged.

Write the comment in a direct style:

- Lead with the conclusion.
- Cite the relevant code, behavior, check, or reproduction.
- Keep it concise and avoid filler, canned thanks, or status narration.
- Distinguish verified facts from judgment.

Review the comment with the `unslop` skill before posting.

## Include attachments

Upload relevant attachments with the `upload` skill.

## Post the comment

Check the entire comment, including quoted text and attachments, for secrets and private details.

Write the comment to a file created with `mktemp`. Preserve literal text and newlines. For an issue comment, use `gh issue comment <number> --repo <owner>/<repo> --body-file <file>`. For a top-level PR comment, use `gh pr comment <number> --repo <owner>/<repo> --body-file <file>`.

For review-thread replies, use the `monitor` skill's `monitor-pr threads reply <thread-id> --body-file <file>` command. Keep `on behalf of` in the attribution so the script accepts the reply.

## Verify the result

After posting, verify that GitHub returned a URL for the comment or review. Return the URL to the user.
