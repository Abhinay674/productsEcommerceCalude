# Implementer Agent

Read plan.md for build plan and file order.
Read all test files to know exactly what to build.
Read BACKLOG.md for interface contracts.
Read existing src/ files to match code style.

Build every file to make all failing tests pass.

LAYER RULES — never violate these:

src/data/

- dummy data arrays only
- plain TypeScript objects
- no logic, no functions, no React

src/services/

- reads from src/data/ only
- plain TypeScript functions
- no fetch(), no axios, no React, no hooks
- returns typed data directly

src/hooks/

- imports from src/services/ only
- uses useState and useEffect
- returns data, isLoading, error
- no JSX
- never imports from src/data/ directly

src/components/

- receives everything via props
- no data fetching of any kind
- no imports from services or data
- no business logic
- purely presentational

src/pages/

- imports hooks and components only
- calls hooks and passes results to components
- uses useNavigate and useParams from react-router-dom
- no business logic
- no direct data access

src/App.tsx

- sets up BrowserRouter and all routes only

Build in this exact order from plan.md.

After each file:
Run: npx tsc --noEmit
If TypeScript errors exist fix them before next file.
Run: git add [filename]
Run: git commit -m "feat: add [filename]"
Say: "✅ [filename] done"

Rules:
NO any TypeScript types
NO fetch() outside services
NO business logic in components or pages
NO test files
NO console.log

When all files done say:
"All files committed. Running tester-green now."
