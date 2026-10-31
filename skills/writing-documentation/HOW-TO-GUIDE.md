# Write a how-to guide

A how-to guide is a recipe. It directs a competent reader at work through a real problem or toward a result. The reader already knows what they want and can follow instructions correctly. A professional chef still follows a recipe to get the dish right.

The set of how-to guides also shows what the product can do. A rich list of guides that answer the right questions is likely to be the most-read part of the docs.

## Choose the goal

Write from the reader's project, not the product's machinery. A guide answers something a person needs to get done, such as "How to configure reconnection back-off" or "How to calibrate the radar array". "How to build a web application" is a whole field of skill, so it is too broad for a guide.

Let tools appear as means to the goal. One guide can cut across several tools or parts of the system when the task does.

Skip what any competent reader knows. "To deploy the configuration, select the options and press Deploy" walks the machinery through its motions and says nothing the interface does not. Write what the reader actually needs instead: which options fit which real-world need.

## Name it

Title the guide with exactly what it shows:

- Good: "How to integrate application performance monitoring".
- Bad: "Integrating application performance monitoring". It could be about whether to do it.
- Very bad: "Application performance monitoring". It could be a how-to, a decision, or an explanation of what it is.

## Write it

- Open with "This guide shows you how to…" and the problem or task.
- Write steps as actions. Actions include thinking and judgment as well as commands: tell the reader what to check and how to decide.
- Use conditional imperatives for real-world variation: "If you want x, do y. To achieve w, do z." Real problems fork and overlap, and a guide can have several entry and exit points.
- Prepare for the unexpected. Unlike a tutorial, the reader's environment is not controlled, so warn where things can go wrong and say how to recover. Often the reader gets one chance to do it right.
- Make it adaptable. A guide useful only for the exact case you wrote is rarely valuable. Leave room for the reader to apply it to their own setup.
- Start and end at sensible points. A guide does not need to be end-to-end; the reader joins it up to their own work.
- Order the steps by necessity first. When the order is free, put first the step that sets up the reader's environment or thinking for the next.
- Keep the guide to action only. Link to the reference for full option lists and to the explanation for the reasons. Each digression breaks the reader's work.

## Seek flow

Order steps the way the reader thinks and works. Keep them in one tool or context as long as possible. Resolve each question soon after you raise it, so the reader holds as little in their head as possible. Avoid sending them back to an earlier step. At its best, the guide anticipates the reader, like a helper who hands over the tool they were about to reach for.

## Use the language of how-to guides

- "This guide shows you how to…"
- "If you want x, do y. To achieve w, do z."
- "Refer to the x reference for a full list of options."

## Check the guide

- The title starts with "How to" and names a goal a person has, not a feature.
- Every step is an action or a decision.
- Background and option lists are links, not paragraphs.
- Each branch says when it applies.
- You ran the commands, or you said which ones you could not run.
