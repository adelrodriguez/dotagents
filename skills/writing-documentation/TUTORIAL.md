# Write a tutorial

A tutorial is a lesson. The reader is at study and learns by doing something meaningful under your guidance. Its purpose is the reader's learning, not the thing they build. What the reader does is the vehicle; what they learn along the way is the names of things, the tools, the workflow, and how the product responds.

A lesson is a contract that puts almost all responsibility on the teacher: what the reader learns, what they do to learn it, and whether they succeed. The reader's only job is to follow the directions. You must be present, yet you are absent: no one is there to rescue a reader who goes off track, so the page must make going off track impossible.

## Design the exercise

Choose an exercise that is:

- Meaningful: the reader finishes with a sense of achievement.
- Successful: every reader can complete it.
- Logical: each step follows sensibly from the last.
- Usefully complete: the reader meets every action, concept, and tool they need to become familiar with.

Set up a contrived, controlled environment. Fix the versions, sample data, and starting state so nothing unexpected can happen. Keep every step safe and repeatable, so the reader can go back to the start and try again.

## Write it

- Show where the reader is going, at the start: "In this tutorial, we will create and deploy a web app. Along the way, we will use containers." Name what they will do, not what they will learn.
- Lead from one concrete step to the next. "First, run x. Now, open y. Now that you have y, do z." Leave no room for doubt.
- Give a visible result after every step, however small, so the reader connects cause and effect.
- Keep up a narrative of the expected. Show the actual output: "The output should look something like this." Warn about surprises: "The command prints several hundred lines of logs." Flag the likely mistakes: "If the output doesn't show x, you probably skipped y."
- Point out what the reader should notice, such as a prompt that changes or a new file that appears. A reader focused on the steps misses these signs unless you name them.
- Be explicit about the basics: where to type the command, which file to open, how long to wait.
- Stay on one path. Leave out options, alternatives, and ways the reader could adapt it.
- Stay concrete. Use this file, this command, this result. The reader will draw the general pattern from the concrete steps; leave abstraction and generalization out.
- Keep explanation to the minimum the step needs, in one plain sentence, with a link to the explanation page.
- Make steps repeatable where you can. Readers repeat a step that works to confirm that it really works.
- Close by describing what the reader built, and admire it mildly: "You have built a secure, three-layer web service."

Resist the four temptations that break a lesson: explanation, abstraction, choices, and extra information. Each one pulls the reader's attention off the task and stops the learning.

## Use the language of tutorials

- "We…": the first-person plural keeps tutor and learner together.
- "In this tutorial, we will…"
- "First, do x. Now, do y."
- "We must always do x before y because… (see the explanation of x)."
- "The output should look something like…"
- "Notice that… Remember that… Let's check…"
- "You have built…"

## Keep it reliable

A tutorial must work for every reader, every time. A reader who follows the steps and gets a different result loses confidence in the tutorial, in the product, and in themselves.

Run every step yourself from a clean environment, in order, and compare each output to what the page shows. When the product changes, rerun the whole tutorial: a change to one step often cascades through the rest of the story. Real readers will still find gaps that you miss, so record any reports from people who tried it.

## Check the tutorial

- The opening says what the reader will build.
- Every step produces a result the page shows.
- The path has no options, branches, or "alternatively".
- Each explanation is one sentence with a link.
- You ran every step from a clean start and every output matched.
