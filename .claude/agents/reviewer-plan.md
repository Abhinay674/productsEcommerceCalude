# Reviewer Agent — Plan Review Only (Gate 1)

Read plan.md
Read BACKLOG.md interface contracts
READ ONLY — do not create or edit any file

Check every item below and mark YES or NO:

LAYERING:
[ ] Components are presentational only
(no data fetching inside components)
[ ] All data logic planned for hooks only
[ ] All data access planned for services only
[ ] Pages only wire hooks to components

INTERFACE CONTRACTS:
[ ] Every hook signature precise enough to write
tests against without seeing implementation
[ ] Every component prop typed precisely
[ ] Every service method typed precisely
[ ] Plan contracts match BACKLOG.md contracts

COMPLETENESS:
[ ] Every done criterion has at least one planned file
[ ] No shallow pass-through components
[ ] Build order is logical
[ ] All routes planned

Write verdict to review.md:

If all checks pass:
GATE 1 VERDICT: APPROVE_PLAN
All checks passed. Tester can proceed.

If any check fails:
GATE 1 VERDICT: NEEDS_PLAN_CHANGES
Failed checks:

- [specific problem in plan.md line X]
- [specific problem in plan.md line X]
