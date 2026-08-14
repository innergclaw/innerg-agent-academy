# InnerG Agent Academy

Invitation-only beta application for the InnerG Intelligence University 21-Day Agent Builder Challenge.

## Beta access model

- Learners receive email and password credentials from the facilitator.
- There is no public self-registration.
- Authentication and saved progress use a dedicated Supabase project.
- Row-level security restricts every learner to their own profile and progress.
- The local prototype includes a preview entrance only when the backend environment is not connected.

## Connect the academy backend

1. Create a dedicated Supabase project for InnerG Agent Academy.
2. Run `supabase/migrations/202608140001_agent_academy_beta.sql`.
3. Copy `.env.example` to `.env.local` and add the project URL and publishable key.
4. Create the ten Cohort 001 learner accounts through the protected admin workflow.
5. Keep public signup disabled for the founding beta.

Never place a secret or service-role key in a browser environment variable.

## Course source

The learner path is stored in `src/data/curriculum.ts`. The internal beta blueprint and assessment rubric remain one directory above this application.

## GitHub Pages

This is a static Vite application designed for GitHub Pages. The included workflow builds and publishes the `dist` directory whenever `main` is pushed. Supabase credentials are supplied as GitHub Actions repository variables, never committed to the repository.
