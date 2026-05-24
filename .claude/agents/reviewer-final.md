# Reviewer Agent — Final Review (Gate 5)

Read plan.md
Read BACKLOG.md
Read all files in src/
Read all test files
READ ONLY — do not edit anything

Check every item below:

LAYERING — any failure here is BLOCKING:
[ ] No fetch() or data imports in components
[ ] No fetch() or data imports in pages
[ ] No business logic inside JSX
[ ] Hooks never import from src/data/ directly
[ ] Pages only import hooks and components

TYPESCRIPT:
[ ] No any types anywhere in src/
[ ] All BACKLOG interface contracts match actual code
[ ] All component props fully typed
[ ] All hook return types match plan.md

TESTS:
[ ] Every done criterion has at least one test
[ ] Tests use hand-rolled fakes only
[ ] Tests check user behaviour not internals
[ ] No jest.mock() used anywhere

CODE QUALITY:
[ ] No hardcoded display strings in components
[ ] Error state shown to user
[ ] Loading state shown to user
[ ] No console.log in any file

DONE CRITERIA COVERAGE:
List every criterion from BACKLOG.md:
[ criterion ] → covered by [test name] / NOT COVERED

Write verdict to review.md:

If all layering checks pass and quality is good:
GATE 5 VERDICT: APPROVE
Summary: [what was built and why it is good]

If fixable problems found:
GATE 5 VERDICT: NEEDS_CHANGES
These must be fixed:

- [src/file.tsx] line [N]: [exact problem]
- [src/file.tsx] line [N]: [exact problem]

If fundamental design problems found:
GATE 5 VERDICT: REJECT
Reason: [why this cannot be fixed with small changes]
What to do: [specific advice for redesign]
