# InnerG Agent Academy

Public landing page and founding beta application for the InnerG Intelligence University 21-Day Agent Builder Challenge.

## Beta access model

- New scholars can create an account from the public academy landing page.
- Scholars confirm their email before entering the application.
- Returning scholars use the same access area to sign in.
- Authentication and saved progress use a dedicated Supabase project.
- First-time learners complete a five-step scholar orientation before entering the campus.
- The orientation saves role, focus, readiness, capstone problem, study rhythm, and completion status.
- Row-level security restricts every learner to their own profile and progress.
- The local prototype includes a preview entrance only when the backend environment is not connected.

## Connect the academy backend

1. Create a dedicated Supabase project for InnerG Agent Academy.
2. Apply every migration in `supabase/migrations` in timestamp order.
3. Copy `.env.example` to `.env.local` and add the project URL and publishable key.
4. Configure the public GitHub Pages URL as an allowed authentication redirect.
5. Keep facilitator roles protected from browser-side profile edits.

Never place a secret or service-role key in a browser environment variable.

## Course source

The learner path is stored in `src/data/curriculum.ts`. The internal beta blueprint and assessment rubric remain one directory above this application.

## GitHub Pages

This is a static Vite application designed for GitHub Pages. The included workflow builds and publishes the `dist` directory whenever `main` is pushed. Supabase credentials are supplied as GitHub Actions repository variables, never committed to the repository.
