import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { lessons, levels, type Lesson } from "../data/curriculum";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";
import { ScholarOnboarding, type ScholarProfile } from "./ScholarOnboarding";

type ProgressRow = {
  lesson_day: number;
  status: "started" | "completed";
  score: number | null;
};

function Crest({ small = false }: { small?: boolean }) {
  return (
    <span className={small ? "crest crest-small" : "crest"} aria-hidden="true">
      <span className="crest-orbit" />
      <span className="crest-letters">IG</span>
      <span className="crest-star">✦</span>
    </span>
  );
}

function Archivist() {
  return (
    <div className="archivist" aria-hidden="true">
      <div className="archivist-cap"><span /></div>
      <div className="archivist-head">
        <span className="archivist-brow left" />
        <span className="archivist-brow right" />
        <span className="archivist-eye left" />
        <span className="archivist-eye right" />
        <span className="archivist-glasses left" />
        <span className="archivist-glasses right" />
        <span className="archivist-bridge" />
        <span className="archivist-smile" />
      </div>
      <div className="archivist-robe"><span>IG</span></div>
    </div>
  );
}

function LoginScreen({ onPreview }: { onPreview: () => void }) {
  const supabase = getSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!supabase) {
      setMessage("Credential access is awaiting the academy database connection.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMessage("Those credentials were not recognized. Check your invitation and try again.");
  }

  async function handleReset() {
    if (!supabase || !email) {
      setMessage("Enter your invited email address first.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: new URL(import.meta.env.BASE_URL, window.location.origin).toString(),
    });
    setBusy(false);
    setMessage(error ? "We could not send the reset link yet." : "A secure reset link is on the way.");
  }

  return (
    <main className="login-shell">
      <section className="login-story" aria-labelledby="academy-title">
        <div className="university-lockup">
          <Crest />
          <div>
            <span>InnerG Intelligence University</span>
            <strong>Established MMXXVI</strong>
          </div>
        </div>

        <div className="login-copy">
          <p className="eyebrow">Founding Beta · Cohort 001</p>
          <h1 id="academy-title">Agent<br /><em>Academy</em></h1>
          <p className="login-thesis">
            Education for people prepared to direct intelligence—not simply use it.
          </p>
          <div className="institution-note">
            <span>21 days</span><i />
            <span>3 levels</span><i />
            <span>1 working system</span>
          </div>
        </div>

        <blockquote>
          “The people who can organize intelligence will shape what comes next.”
          <cite>— InnerG Intel</cite>
        </blockquote>
      </section>

      <section className="login-panel" aria-label="Scholar sign in">
        <div className="login-form-wrap">
          <div className="scholar-seal"><span>01</span></div>
          <p className="form-kicker">Private scholar entrance</p>
          <h2>Enter the academy.</h2>
          <p className="form-intro">Use the credentials issued with your Cohort 001 invitation.</p>

          <form onSubmit={handleLogin}>
            <label htmlFor="academy-email">Scholar email</label>
            <input id="academy-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@email.com" required />

            <label htmlFor="academy-password">Password</label>
            <input id="academy-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your private password" required />

            <div className="password-row">
              <span>Invitation-only access</span>
              <button type="button" onClick={handleReset}>Forgot password?</button>
            </div>

            <button className="primary-button" type="submit" disabled={busy}>
              <span>{busy ? "Verifying credentials…" : "Enter the academy"}</span>
              <b aria-hidden="true">→</b>
            </button>
          </form>

          {message && <p className="form-message" role="status">{message}</p>}

          {import.meta.env.DEV && !isSupabaseConfigured && (
            <div className="preview-access">
              <span>Local prototype</span>
              <p>Review the complete scholar experience before Cohort 001 accounts are issued.</p>
              <button type="button" onClick={onPreview}>Preview as a founding scholar</button>
            </div>
          )}

          <footer>
            <span>InnerG Intel</span>
            <span>Ownership · Intelligence · Application</span>
          </footer>
        </div>
      </section>
    </main>
  );
}

function MissionDrawer({ lesson, status, onClose, onComplete }: { lesson: Lesson; status: "available" | "completed" | "locked"; onClose: () => void; onComplete: (day: number) => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButton.current?.focus();
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="drawer-backdrop" role="presentation">
      <button className="drawer-scrim" onClick={onClose} aria-label="Close mission details" />
      <section className="mission-drawer" role="dialog" aria-modal="true" aria-labelledby="mission-title">
        <button ref={closeButton} className="drawer-close" onClick={onClose} aria-label="Close mission">×</button>
        <div className="drawer-heading">
          <span>Day {String(lesson.day).padStart(2, "0")} · Level {lesson.level}</span>
          <b>{lesson.kind === "checkpoint" ? "Examination" : lesson.kind === "capstone" ? "Capstone" : lesson.levelName}</b>
        </div>
        <h2 id="mission-title">{lesson.title}</h2>
        <p className="drawer-objective">{lesson.objective}</p>

        <div className="mission-brief">
          <span>Your mission</span>
          <p>{lesson.mission}</p>
        </div>

        <dl>
          <div><dt>Evidence</dt><dd>{lesson.evidence}</dd></div>
          <div><dt>Study time</dt><dd>{lesson.minutes} minutes</dd></div>
          <div><dt>Credit</dt><dd>1 academy credit</dd></div>
        </dl>

        {status === "locked" ? (
          <button className="drawer-action locked" disabled>Complete the previous mission first</button>
        ) : status === "completed" ? (
          <button className="drawer-action completed" disabled>Mission completed ✓</button>
        ) : (
          <button className="drawer-action" onClick={() => onComplete(lesson.day)}>Mark mission complete</button>
        )}
        <p className="integrity-note">Beta note: evidence submission and knowledge checks connect in the next build.</p>
      </section>
    </div>
  );
}

function Dashboard({ session, preview, initialProfileName, onExit }: { session: Session | null; preview: boolean; initialProfileName?: string; onExit: () => void }) {
  const supabase = getSupabaseClient();
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [profileName, setProfileName] = useState(initialProfileName || (preview ? "Founding Scholar" : "Scholar"));
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-scroll"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.14, rootMargin: "0px 0px -8%" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!supabase || !session?.user) return;
    const userId = session.user.id;
    Promise.all([
      supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
      supabase.from("lesson_progress").select("lesson_day,status,score").eq("user_id", userId),
    ]).then(([profileResult, progressResult]) => {
      if (profileResult.data?.full_name) setProfileName(profileResult.data.full_name);
      else setProfileName(session.user.email?.split("@")[0] || "Scholar");
      if (progressResult.data) setProgress(progressResult.data as ProgressRow[]);
    });
  }, [session, supabase]);

  const completedDays = useMemo(() => new Set(progress.filter((row) => row.status === "completed").map((row) => row.lesson_day)), [progress]);
  const completedCount = completedDays.size;
  const currentDay = Math.min(completedCount + 1, 21);
  const percent = Math.round((completedCount / 21) * 100);
  const currentLesson = lessons[currentDay - 1];

  function lessonStatus(day: number): "available" | "completed" | "locked" {
    if (completedDays.has(day)) return "completed";
    if (day === currentDay) return "available";
    return "locked";
  }

  async function completeMission(day: number) {
    if (preview || !supabase || !session?.user) {
      setProgress((current) => [...current.filter((row) => row.lesson_day !== day), { lesson_day: day, status: "completed", score: null }]);
      setSelected(null);
      return;
    }
    const { error } = await supabase.from("lesson_progress").upsert({
      user_id: session.user.id,
      lesson_day: day,
      status: "completed",
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_day" });
    if (!error) {
      setProgress((current) => [...current.filter((row) => row.lesson_day !== day), { lesson_day: day, status: "completed", score: null }]);
      setSelected(null);
    }
  }

  async function signOut() {
    if (supabase && session) await supabase.auth.signOut();
    onExit();
  }

  return (
    <div className="academy-shell">
      <aside className={mobileMenu ? "academy-sidebar is-open" : "academy-sidebar"}>
        <div className="sidebar-brand">
          <Crest small />
          <div><strong>InnerG</strong><span>Agent Academy</span></div>
        </div>
        <button className="mobile-close" onClick={() => setMobileMenu(false)} aria-label="Close navigation">×</button>

        <nav aria-label="Academy navigation">
          <a className="active" href="#campus"><span>01</span>Campus</a>
          <a href="#course-path"><span>02</span>Course path</a>
          <a href="#field-notes"><span>03</span>Field notes</a>
          <a href="https://discord.gg/s4HK9fdJQc" target="_blank" rel="noreferrer"><span>04</span>Cohort hall</a>
        </nav>

        <div className="sidebar-motto">
          <i>✦</i>
          <p>Learn the system.<br />Build the proof.<br />Keep the ownership.</p>
        </div>

        <button className="account-button" onClick={signOut}>
          <span>{profileName.slice(0, 1).toUpperCase()}</span>
          <div><strong>{profileName}</strong><small>{preview ? "Prototype access" : "Cohort 001"}</small></div>
          <b>↗</b>
        </button>
      </aside>

      {mobileMenu && <button className="sidebar-scrim" onClick={() => setMobileMenu(false)} aria-label="Close navigation" />}

      <main className="academy-main" id="campus">
        <header className="academy-header">
          <button className="mobile-menu" onClick={() => setMobileMenu(true)} aria-label="Open navigation"><span /><span /></button>
          <div>
            <p>InnerG Intelligence University</p>
            <h1>Good day, {profileName}.</h1>
          </div>
          <div className="header-status">
            <span>Founding Beta</span>
            <b>Cohort 001</b>
          </div>
        </header>

        <section className="welcome-grid">
          <article className="welcome-card">
            <div className="welcome-copy">
              <p className="eyebrow">Your current frequency</p>
              <h2>{currentLesson.title}</h2>
              <p>{currentLesson.objective}</p>
              <button onClick={() => setSelected(currentLesson)}>
                Continue Day {String(currentDay).padStart(2, "0")} <span>→</span>
              </button>
            </div>
            <div className="mentor-scene">
              <div className="mentor-message">
                <span>The Archivist</span>
                <p>{completedCount === 0 ? "Start with a real problem. The tool comes second." : completedCount < 14 ? "Proof over performance. Keep building." : "You are no longer prompting. You are designing systems."}</p>
              </div>
              <Archivist />
            </div>
          </article>

          <article className="credit-card">
            <span className="credit-label">Academy record</span>
            <div className="credit-number"><strong>{String(completedCount).padStart(2, "0")}</strong><span>/ 21<br />credits</span></div>
            <div className="progress-track"><i style={{ width: `${percent}%` }} /></div>
            <p>{percent}% of the founding path complete</p>
            <div className="mini-marks"><span>Operator</span><span>Builder</span><span>Architect</span></div>
          </article>
        </section>

        <section className="path-layout" id="course-path">
          <div className="path-column">
            <div className="section-heading">
              <div><p className="eyebrow">Curriculum</p><h2>The scholar’s path</h2></div>
              <p>Every mission produces evidence. Complete the work to unlock what follows.</p>
            </div>

            <div className="learning-path">
              {levels.map((level) => (
                <section className="level-section reveal-on-scroll" data-reveal={level.id % 2 === 0 ? "right" : "left"} key={level.id}>
                  <header className={`level-banner level-${level.id}`}>
                    <span>Level {level.roman}</span>
                    <div><strong>{level.name}</strong><small>{level.promise}</small></div>
                    <b>{Math.min(7, Math.max(0, completedCount - (level.id - 1) * 7))}/7</b>
                  </header>

                  <div className="level-nodes">
                    {lessons.filter((lesson) => lesson.level === level.id).map((lesson, index) => {
                      const status = lessonStatus(lesson.day);
                      return (
                        <div className={`path-stop stop-${index % 3} ${status}`} key={lesson.day}>
                          <button onClick={() => setSelected(lesson)} aria-label={`Day ${lesson.day}: ${lesson.title}. ${status}.`}>
                            <span>{status === "completed" ? "✓" : lesson.kind === "checkpoint" ? "✦" : String(lesson.day).padStart(2, "0")}</span>
                          </button>
                          <div className="node-label">
                            <small>Day {String(lesson.day).padStart(2, "0")}</small>
                            <strong>{lesson.title}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside className="academy-rail">
            <article className="rail-card oath-card reveal-on-scroll" data-reveal="right">
              <span>Scholar’s oath</span>
              <blockquote>“I will use intelligence to create value, preserve truth, and keep human judgment where it belongs.”</blockquote>
              <small>InnerG Intelligence University</small>
            </article>

            <article className="rail-card standing-card reveal-on-scroll" data-reveal="right">
              <div className="rail-title"><span>Weekly standing</span><b>Week 01</b></div>
              <dl>
                <div><dt>Missions</dt><dd>{Math.min(completedCount, 7)} / 7</dd></div>
                <div><dt>Evidence</dt><dd>{completedCount}</dd></div>
                <div><dt>Examinations</dt><dd>{[7, 14, 21].filter((day) => completedDays.has(day)).length} / 3</dd></div>
              </dl>
            </article>

            <article className="rail-card dispatch-card reveal-on-scroll" data-reveal="right" id="field-notes">
              <span>Campus dispatch</span>
              <h3>Build Lab · Thursday</h3>
              <p>Bring one failed output. We will study the failure, repair the system, and document what changed.</p>
              <a href="https://discord.gg/s4HK9fdJQc" target="_blank" rel="noreferrer">Enter Cohort Hall →</a>
            </article>

            <article className="rail-card beta-card reveal-on-scroll" data-reveal="right">
              <span>Founding scholar</span>
              <p>Your feedback shapes the permanent academy. Document confusion as carefully as success.</p>
            </article>
          </aside>
        </section>

        <footer className="academy-footer">
          <span>InnerG Intel · Agent Academy</span>
          <span>Ownership · Intelligence · Application</span>
          <span>MMXXVI</span>
        </footer>
      </main>

      {selected && <MissionDrawer lesson={selected} status={lessonStatus(selected.day)} onClose={() => setSelected(null)} onComplete={completeMission} />}
    </div>
  );
}

export function AcademyApp() {
  const supabase = getSupabaseClient();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(Boolean(supabase));
  const [preview, setPreview] = useState(false);
  const [profileStatus, setProfileStatus] = useState<"checking" | "needed" | "done">("checking");
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setProfileStatus("checking");
        setProfileName("");
      }
      setChecking(false);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !session?.user) return;
    supabase
      .from("profiles")
      .select("full_name,onboarding_completed")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setProfileName(data?.full_name || session.user.email?.split("@")[0] || "Scholar");
        setProfileStatus(data?.onboarding_completed ? "done" : "needed");
      });
  }, [session, supabase]);

  async function exitAcademy() {
    if (supabase && session) await supabase.auth.signOut();
    setPreview(false);
    setProfileStatus("checking");
    setProfileName("");
  }

  function completeOrientation(profile: ScholarProfile) {
    setProfileName(profile.full_name);
    setProfileStatus("done");
  }

  if (checking || (session && profileStatus === "checking")) {
    return <div className="academy-loading"><Crest /><span>Opening the academy…</span></div>;
  }

  if (session || preview) {
    if (profileStatus !== "done") {
      return (
        <ScholarOnboarding
          session={session}
          preview={preview}
          initialName={profileName || session?.user.email?.split("@")[0] || ""}
          onComplete={completeOrientation}
          onExit={() => void exitAcademy()}
        />
      );
    }
    return <Dashboard session={session} preview={preview} initialProfileName={profileName} onExit={() => void exitAcademy()} />;
  }

  return <LoginScreen onPreview={() => {
    setProfileName("");
    setProfileStatus("needed");
    setPreview(true);
  }} />;
}
