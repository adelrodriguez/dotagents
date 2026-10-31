---
name: upload-file
description: Use when attaching files to a pull request or comment, or when another skill needs a public file URL.
---

# Upload a file

Upload a file with the `upload` script, then link or embed the public URL it returns.

## Check the file first

Anyone with the URL can access the uploaded file and keep a copy. Before uploading, check the whole file, including every video frame, for secrets, tokens, personal data, and private details.

If the file comes from a private repository or shows a private app, get the user's approval before uploading unless they already approved uploads for this task.

## Run the script

Run `scripts/upload` from this skill's directory, using its absolute path:

```bash
upload <file>
```

The script prints the file's URL on stdout. Use that URL exactly as printed.

The script names each file by the SHA-256 of its content and keeps its extension. The same file always gets the same URL, so uploading a file that is already in the bucket returns its existing URL without uploading it again.

The script returns these exit codes:

- `0`: the file is in the bucket and its URL is printed.
- `64`: the arguments are invalid.
- `66`: the path is not a file.
- `78`: a setting is missing or could not be read. If the machine has no 1Password service account, tell the user and point them to [Set up a machine](#set-up-a-machine). Otherwise, set the named `FILE_UPLOAD_*` variable or address the reported 1Password access or CLI issue.
- Any other code: inspect the error, retry once, then report the failure if the retry fails.

## Use the URL

Embed images in Markdown with descriptive alt text:

```md
![Settings page after the fix, with the new toggle](https://<host>/<sha256>.png)
```

Link videos and other files. GitHub embeds a video player only for files uploaded through its own interface.

Show before-and-after images side by side in a table with columns labeled "Before" and "After".

If an upload fails, say which attachment is missing instead of leaving a broken link.

## Configure the upload script

Set these environment variables or store the values in the matching fields of the `FILE_UPLOAD` item in 1Password. Environment variables take precedence.

The default item is `op://Agents/FILE_UPLOAD`. Set `FILE_UPLOAD_OP_REF` to use another item.

| Variable | 1Password field |
| --- | --- |
| `FILE_UPLOAD_ACCESS_KEY_ID` | `access_key_id` |
| `FILE_UPLOAD_SECRET_ACCESS_KEY` | `secret_access_key` |
| `FILE_UPLOAD_ACCOUNT_ID` | `account_id` |
| `FILE_UPLOAD_BUCKET` | `bucket` |
| `FILE_UPLOAD_PUBLIC_URL` | `public_url` |

Never print, log, or commit these values.

### Set up a machine

The script reads 1Password as a service account, so it never shows an approval prompt. Each machine needs its own service account with read-only access to the `Agents` vault. Save its token once per machine:

```bash
bash -c 'umask 077; mkdir -p ~/.config/agents; read -rsp "Token: " t; printf "%s\n" "$t" > ~/.config/agents/1password-token; echo'
```

The script loads the token for its own `op` calls, so it works under any agent host. An `OP_SERVICE_ACCOUNT_TOKEN` that is already set takes precedence.
