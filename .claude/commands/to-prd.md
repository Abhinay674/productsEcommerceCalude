# Generate PRD

Based on everything discussed in this session,
first show a module sketch:

"Proposed modules:

- [ComponentName]: [one line purpose]
- [hookName]: [one line purpose]
- [serviceName]: [one line purpose]"

Ask: "Does this module shape look correct?
Any shallow components? Anything missing?"

Wait for user response.

After user confirms, write the full PRD:

---

Problem: [one sentence]
Solution: [one sentence]

User Stories:

- As a user I can [action] so that [outcome]
- As a user I can [action] so that [outcome]
- As a user I can [action] so that [outcome]
- As a user I can [action] so that [outcome]
- As a user I can [action] so that [outcome]

Implementation decisions:

- [decision]: [reason]
- [decision]: [reason]

Testing decisions:

- [what gets unit tested]
- [what gets component tested]

Out of scope:

- [excluded item]
- [excluded item]

---

Rules:

- Minimum 4 user stories
- Every story must be testable with Jest expect()
- No vague stories like "should look nice"

Say: "Type /to-backlog 001 when ready."
