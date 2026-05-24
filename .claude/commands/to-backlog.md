# Create BACKLOG Entry

Feature number: $ARGUMENTS

Create BACKLOG.md if it does not exist.
If it exists append to it.

Write this exact format:

---

## #$ARGUMENTS [Feature Name] status: todo

Why: [one line reason]
What: [one line description]

Patterns to follow:

- [existing pattern in codebase to follow]
- [existing pattern in codebase to follow]

Interface contracts:

- hookName(param: Type): { field: Type, field: Type }
- serviceName.method(param: Type): Promise<Type>
- TypeName: { field: type, field: type }
- Route: /path → <ComponentName />

Done criteria:
[ ] [specific user behaviour testable with expect()]
[ ] [specific user behaviour testable with expect()]
[ ] [specific user behaviour testable with expect()]
[ ] [specific user behaviour testable with expect()]
[ ] [specific user behaviour testable with expect()]

Out of scope: [comma separated list]

ADRs:

- [architecture decision made during planning]

---

Traceability check:
For every user story in the PRD verify at least
one done criterion covers it.
If any story has no criterion flag it immediately.

Commit BACKLOG.md with message:
"chore: add feature #$ARGUMENTS to backlog"

Then say:
"BACKLOG.md committed.

Now exit this session completely.
Then from your terminal run:
claude --agent orchestrator Run feature #$ARGUMENTS

The autonomous pipeline will take over from here."
