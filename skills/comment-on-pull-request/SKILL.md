---
name: comment-on-pull-request
description: Use when posting a comment on a pull request.
metadata:
  reference:
    - "https://github.com/t3dotgg/tstack/blob/main/skills/leaving-pr-comments/SKILL.md"
---

# Comment on a pull request

For each comment you write on the user's behalf, start with this GitHub note callout:

```md
> [!NOTE]
> 🤖 **<model> (on behalf of <user>)**

Actual comment starts here.
```

Use the verified public name of the model that wrote the comment and the user's name or GitHub login.

If the model name is unavailable, use the harness name.

Keep the attribution inside the note and the comment outside it. Start the attribution line with the robot emoji. Do not add a horizontal rule, Setext underline, heading, signature footer, or second attribution.

Apply this format to top-level PR comments, inline review comments, replies to bots or reviewers, and explanations posted before you resolve or dismiss feedback. Leave PR descriptions, commit messages, and text the user explicitly asks to post verbatim without attribution unchanged.

Upload relevant attachments with the `upload-file` skill.

Write the comment in a direct style:

- Lead with the conclusion.
- Cite the relevant code, behavior, check, or reproduction.
- Keep it concise and avoid filler, canned thanks, or status narration.
- Distinguish verified facts from judgment.

Review the comment with the `unslop` skill before posting.

Check the entire comment, including quoted text and attachments, for secrets and private details. Preview the Markdown to check that quotes and blank lines render as shown.

After posting, verify that GitHub returned a URL for the comment or review.
