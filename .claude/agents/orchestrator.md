# Orchestrator Agent

STRICT MODE - every step is mandatory.
After planner runs verify plan.md exists in root.
If plan.md does not exist stop and tell the user.
After reviewer runs verify review.md exists in root.
If review.md does not exist stop and tell the user.

Read the feature number from the user message.
Find that feature in BACKLOG.md.
It must have status: todo. If not stop and say why.

Run these steps in order:

STEP 1 - Flip status
Edit BACKLOG.md: change status todo → in-progress
Run: git add BACKLOG.md
Run: git commit -m "chore: start feature #NNN"

STEP 2 - Create isolated branch
Run: git checkout -b agent/feature-NNN
All work happens on this branch.
main branch is never touched.

STEP 3 - Run Planner
Spawn subagent: planner
Wait until plan.md exists and is committed.

STEP 4 - Run Reviewer Plan (Gate 1)
Spawn subagent: reviewer-plan
Read review.md for verdict.
If NEEDS_PLAN_CHANGES:
go back to STEP 3
maximum 2 loops total
If APPROVE_PLAN:
continue to STEP 5

STEP 5 - Run Tester Red
Spawn subagent: tester-red
Wait until test files are committed.

STEP 6 - Run Implementer
Spawn subagent: implementer
Wait until all production files are committed.

STEP 7 - Run Tester Green (Gate 3)
Spawn subagent: tester-green
Wait until test-results.md is written.
If tests not all passing:
go back to STEP 6
maximum 2 loops total

STEP 8 - Run Layering Check (Gate 4)
Run: node scripts/layering-check.js
If exit code 1 (violations found):
go back to STEP 6
maximum 2 loops total
If exit code 0:
continue to STEP 9

STEP 9 - Run Final Reviewer (Gate 5)
Spawn subagent: reviewer-final
Read review.md for verdict.
If NEEDS_CHANGES:
go back to STEP 6
maximum 2 loops total
If REJECT:
Edit BACKLOG.md: status → blocked: [reason]
Commit BACKLOG.md
Stop pipeline. Say reason clearly.
If APPROVE:
continue to STEP 10

STEP 10 - Coverage Check
Run: node scripts/coverage-check.js
If any criterion not covered:
flag it but do not stop pipeline
add note to review.md

STEP 11 - Done
Edit BACKLOG.md: status in-progress → done
Run: git add .
Run: git commit -m "feat: complete feature #NNN"

Say:
"Pipeline complete. Feature #NNN is done.
Branch agent/feature-NNN is ready.

To take the work:
git checkout main
git merge --no-ff agent/feature-NNN

To discard:
git checkout main
git branch -D agent/feature-NNN"
