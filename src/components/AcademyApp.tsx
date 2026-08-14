import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import comicArtwork from "../assets/innerg-agent-academy-comic.jpg";
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
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!supabase) {
      setMessage("Credential access is awaiting the academy database connection.");
      return;
    }
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName.trim() } },
      });
      setBusy(false);
      if (error) {
        setMessage(error.message.includes("Password") ? error.message : "We could not create your scholar account yet. Check the details and try again.");
        return;
      }
      setMessage("Your confirmation is on the way. Open the email, confirm your address, then return here and sign in.");
      return;
    }
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
    <section className="login-shell" aria-labelledby="academy-access-title">
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
          <h2 id="academy-title">Agent<br /><em>Academy</em></h2>
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

      <section className="login-panel" id="academy-access" aria-label="Scholar sign in">
        <div className="login-form-wrap">
          <div className="scholar-seal"><span>01</span></div>
          <p className="form-kicker">Cohort 001 enrollment</p>
          <h2 id="academy-access-title">{mode === "signup" ? "Claim your seat." : "Welcome back."}</h2>
          <p className="form-intro">{mode === "signup" ? "Create your scholar account. Your orientation begins after email confirmation." : "Use your confirmed scholar credentials to continue your path."}</p>

          <div className="access-tabs" aria-label="Choose account access mode">
            <button type="button" className={mode === "signup" ? "active" : ""} aria-pressed={mode === "signup"} onClick={() => { setMode("signup"); setMessage(""); }}>New scholar</button>
            <button type="button" className={mode === "login" ? "active" : ""} aria-pressed={mode === "login"} onClick={() => { setMode("login"); setMessage(""); }}>Returning scholar</button>
          </div>

          <form onSubmit={handleAccess}>
            {mode === "signup" && (
              <>
                <label htmlFor="academy-name">Full name</label>
                <input id="academy-name" type="text" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your name" minLength={2} required />
              </>
            )}
            <label htmlFor="academy-email">Scholar email</label>
            <input id="academy-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@email.com" required />

            <label htmlFor="academy-password">Password</label>
            <input id="academy-password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === "signup" ? "Create at least 8 characters" : "Your private password"} minLength={8} required />

            <div className="password-row">
              <span>{mode === "signup" ? "Email confirmation required" : "Confirmed scholar access"}</span>
              {mode === "login" && <button type="button" onClick={handleReset}>Forgot password?</button>}
            </div>

            <button className="primary-button" type="submit" disabled={busy}>
              <span>{busy ? (mode === "signup" ? "Creating your record…" : "Verifying credentials…") : (mode === "signup" ? "Join the founding beta" : "Enter the academy")}</span>
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
    </section>
  );
}

const comicPanels = [
  {
    number: "01",
    title: "The question",
    speaker: "Malik",
    dialogue: "Everybody keeps saying agents are the future. But what are they actually doing—and who is learning to direct them?",
    art: "comic-art-one",
    alt: "Four young Black adults discussing AI around laptops in a neighborhood coffee shop at night.",
  },
  {
    number: "02",
    title: "The signal",
    speaker: "Imani",
    dialogue: "This InnerG transmission says prompts are only the beginning. The real skill is organizing people, tools, and intelligence.",
    art: "comic-art-two",
    alt: "The group discovering an illuminated agent network on a laptop screen.",
  },
  {
    number: "03",
    title: "The training",
    speaker: "Nia",
    dialogue: "Operator. Builder. Architect. Twenty-one missions—and every lesson ends with proof we can actually use.",
    art: "comic-art-three",
    alt: "The same group collaborating on agent workflow diagrams in a prestigious learning lab.",
  },
  {
    number: "04",
    title: "The frontier",
    speaker: "Jay",
    dialogue: "Then we stop watching the future happen. We become the orchestrators and builders shaping what comes next.",
    art: "comic-art-four",
    alt: "The group standing confidently on a Philadelphia rooftop at sunrise with laptops and notebooks.",
  },
] as const;

function PublicLanding({ onPreview }: { onPreview: () => void }) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".public-reveal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8%" });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="public-site">
      <header className="public-nav">
        <a className="public-brand" href="#top" aria-label="InnerG Agent Academy home">
          <Crest small />
          <span><strong>InnerG</strong><small>Agent Academy</small></span>
        </a>
        <nav aria-label="Public navigation">
          <a href="#origin-story">The story</a>
          <a href="#academy-path">The path</a>
          <a className="nav-enroll" href="#academy-access">Join the beta</a>
        </nav>
      </header>

      <section className="public-hero" id="top">
        <div className="hero-copy public-reveal">
          <p className="public-kicker">InnerG Intelligence University · Cohort 001</p>
          <h1>The future needs<br /><em>orchestrators.</em></h1>
          <p className="hero-deck">A hands-on agent learning experience for people ready to move beyond prompts, build useful systems, and keep human judgment in command.</p>
          <div className="hero-actions">
            <a className="hero-primary" href="#origin-story">Enter the story <span>↓</span></a>
            <a className="hero-secondary" href="#academy-access">I’m ready to join</a>
          </div>
        </div>
        <aside className="hero-dossier public-reveal" aria-label="Founding beta facts">
          <span className="dossier-stamp">Founding<br />Beta</span>
          <p>Intelligence is becoming infrastructure. This academy prepares you to direct it with clarity, build with evidence, and protect what remains human.</p>
          <dl>
            <div><dt>Duration</dt><dd>21 days</dd></div>
            <div><dt>Levels</dt><dd>03</dd></div>
            <div><dt>Final proof</dt><dd>1 working system</dd></div>
          </dl>
        </aside>
        <div className="hero-scroll-note" aria-hidden="true"><span>Scroll to receive transmission</span><i /></div>
      </section>

      <section className="comic-section" id="origin-story" aria-labelledby="comic-title">
        <header className="comic-heading public-reveal">
          <div><span>Issue 001</span><p>An InnerG Intel origin story</p></div>
          <h2 id="comic-title">From curious<br />to capable.</h2>
          <p>Four friends. One question. A future that will not wait for permission.</p>
        </header>

        <div className="comic-grid">
          {comicPanels.map((panel, index) => (
            <article className={`comic-panel panel-${index + 1} public-reveal`} key={panel.number}>
              <div className={`comic-art ${panel.art}`} style={{ backgroundImage: `url(${comicArtwork})` }} role="img" aria-label={panel.alt} />
              <div className="comic-caption"><span>{panel.number} · {panel.title}</span></div>
              <blockquote><b>{panel.speaker}</b><p>“{panel.dialogue}”</p></blockquote>
            </article>
          ))}
        </div>

        <div className="comic-turn public-reveal">
          <span>Turn the page</span>
          <p>You do not need to know everything about AI before you begin. You need a real problem, the discipline to test your work, and a community serious about building.</p>
          <a href="#academy-path">See the training path →</a>
        </div>
      </section>

      <section className="public-path" id="academy-path" aria-labelledby="public-path-title">
        <div className="path-intro public-reveal">
          <p className="public-kicker">The scholar’s path</p>
          <h2 id="public-path-title">Three levels.<br /><em>One transformation.</em></h2>
          <p>You enter with curiosity. You leave able to specify, build, test, explain, and defend a working agent system.</p>
        </div>
        <div className="public-levels">
          {levels.map((level, index) => (
            <article className={`public-level level-card-${level.id} public-reveal`} key={level.id}>
              <header><span>0{index + 1}</span><b>Level {level.roman}</b></header>
              <h3>{level.name}</h3>
              <p>{level.promise}</p>
              <ul>
                {index === 0 && <><li>Think beyond one-off prompts</li><li>Define outcomes and boundaries</li><li>Verify claims and uncertainty</li></>}
                {index === 1 && <><li>Break work into agent jobs</li><li>Connect tools and permissions</li><li>Test, debug, and recover</li></>}
                {index === 2 && <><li>Design human approval gates</li><li>Build evaluations and safeguards</li><li>Defend a working capstone</li></>}
              </ul>
              <small>Days {index * 7 + 1}–{index * 7 + 7}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="network-callout public-reveal" aria-label="InnerG network invitation">
        <div><span>Not another passive course</span><h2>Learn in public.<br />Build with the network.</h2></div>
        <p>Agent Academy connects the curriculum to the InnerG Intel community: shared field notes, build labs, honest failure analysis, and people developing the next language of work together.</p>
        <a href="https://discord.gg/s4HK9fdJQc" target="_blank" rel="noreferrer">Visit the network <span>↗</span></a>
      </section>

      <LoginScreen onPreview={onPreview} />

      <footer className="public-footer">
        <span>InnerG Intel · Agent Academy</span>
        <span>Ownership · Intelligence · Application</span>
        <span>Philadelphia · MMXXVI</span>
      </footer>
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

  return <PublicLanding onPreview={() => {
    setProfileName("");
    setProfileStatus("needed");
    setPreview(true);
  }} />;
}
