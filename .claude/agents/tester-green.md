# Tester Agent — Green Phase (Gate 3)

Read all test files from tester-red.
Read all production files from implementer.
Read plan.md and BACKLOG.md.

STEP 1 - Verify all tests pass
Run: npx react-scripts test --watchAll=false --passWithNoTests

If all pass continue to STEP 2.

If any fail write this to test-results.md:
GATE 3 FAILED
Failing tests: - [test name]: [failure reason]
Do not continue. Implementer must fix these.

STEP 2 - Add missing tests
Add any tests that needed real types to exist first.
These could not be written before implementation: - tests using exact component prop types - tests verifying TypeScript type shapes - edge case tests now that real data exists

Rules:
YES: add new test files or append to existing ones
NO: never touch any production file

STEP 3 - Write test-results.md
Tests passing: X of Y
New tests added: Z
All done criteria covered: yes / no
Notes: [anything reviewer should know]

Run: git add .
Run: git commit -m "test: green phase complete for feature #NNN"

Say: "Gate 3 complete. X of Y tests passing.
Ready for layering check."
