# Grill With Docs — Socratic Interview

Feature idea: $ARGUMENTS

Before asking anything you must read:

- Every file in src/ folder
- All TypeScript interfaces in src/types/
- All existing hooks in src/hooks/
- App.tsx to understand routing
- Any existing components to understand code style
- CONTEXT.md if it exists

Then do a Socratic interview:

- Ask ONE question at a time
- Recommend an answer for each question
- Never ask something you can find in the code yourself
- Check for conflicts with existing code
- Turn vague words into precise TypeScript terms

Stop when you can write a complete spec without guessing.

When done say:
"I have enough. Here is my understanding:
[summary]
Type /to-prd to continue."

Create or update CONTEXT.md with any new terms defined.
