import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { cohort } from "../data/cohort";
import { getSupabaseClient } from "../lib/supabase";

export type ScholarProfile = {
  full_name: string;
  scholar_role: string;
  primary_focus: string;
  experience_level: "explorer" | "operator" | "builder";
  capstone_goal: string;
  weekly_commitment: "steady" | "focused" | "intensive";
};

type OnboardingProps = {
  session: Session | null;
  preview: boolean;
  initialName: string;
  onComplete: (profile: ScholarProfile) => void;
  onExit: () => void;
};

const stages = [
  { number: "00", label: "Orientation" },
  { number: "01", label: "Scholar profile" },
  { number: "02", label: "Readiness" },
  { number: "03", label: "Your mission" },
  { number: "04", label: "Roadmap" },
] as const;

const roleOptions = [
  { value: "founder", label: "Founder", note: "Building an organization, offer, or operation" },
  { value: "creative", label: "Creative", note: "Designing, writing, producing, or publishing" },
  { value: "educator", label: "Educator", note: "Teaching, mentoring, or developing curriculum" },
  { value: "professional", label: "Professional", note: "Improving how work gets researched and delivered" },
  { value: "student", label: "Student", note: "Building fluency, proof, and future-ready skills" },
  { value: "builder", label: "Developer / Builder", note: "Turning workflows into dependable systems" },
] as const;

const focusOptions = [
  "Build a business system",
  "Improve how I work",
  "Learn agent development",
  "Teach or serve others",
  "Explore what is possible",
] as const;

const experienceOptions = [
  {
    value: "explorer",
    title: "Explorer",
    signal: "I mostly use one prompt at a time.",
    guidance: "We will strengthen how you define outcomes, context, and verification.",
  },
  {
    value: "operator",
    title: "Operator",
    signal: "I can direct a structured AI task.",
    guidance: "We will turn your strongest tasks into repeatable workflows.",
  },
  {
    value: "builder",
    title: "Builder",
    signal: "I have tested workflows, tools, or agents.",
    guidance: "We will improve your architecture, evaluation, and human oversight.",
  },
] as const;

const commitmentOptions = [
  { value: "steady", title: "Steady", note: "3 sessions · 30 minutes" },
  { value: "focused", title: "Focused", note: "5 sessions · 30 minutes" },
  { value: "intensive", title: "Intensive", note: "5 sessions · 45 to 60 minutes" },
] as const;

const roadmap = [
  {
    level: "I",
    name: "Operator",
    days: "Days 01 to 07",
    promise: "Direct intelligence with clarity.",
    proof: ["Outcome Contract", "Context Pack", "Workflow Map", "Operator Examination"],
  },
  {
    level: "II",
    name: "Builder",
    days: "Days 08 to 14",
    promise: "Assemble and test the workflow.",
    proof: ["Tool Map", "Working Agent", "Memory Rules", "Builder Examination"],
  },
  {
    level: "III",
    name: "Architect",
    days: "Days 15 to 21",
    promise: "Design a dependable system.",
    proof: ["System Specification", "Evaluation Set", "Risk Review", "Final Defense"],
  },
] as const;

function SelectionMark({ selected }: { selected: boolean }) {
  return <span className={selected ? "selection-mark selected" : "selection-mark"} aria-hidden="true"><i /></span>;
}

export function ScholarOnboarding({ session, preview, initialName, onComplete, onExit }: OnboardingProps) {
  const supabase = getSupabaseClient();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<ScholarProfile>({
    full_name: initialName,
    scholar_role: "",
    primary_focus: "",
    experience_level: "explorer",
    capstone_goal: "",
    weekly_commitment: "focused",
  });
  const [oathAccepted, setOathAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  const canContinue = useMemo(() => {
    if (step === 1) return profile.full_name.trim().length >= 2 && Boolean(profile.scholar_role) && Boolean(profile.primary_focus);
    if (step === 2) return Boolean(profile.experience_level);
    if (step === 3) return profile.capstone_goal.trim().length >= 20 && Boolean(profile.weekly_commitment);
    if (step === 4) return oathAccepted;
    return true;
  }, [oathAccepted, profile, step]);

  function updateProfile<Key extends keyof ScholarProfile>(key: Key, value: ScholarProfile[Key]) {
    setProfile((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  async function finishOrientation() {
    if (!canContinue) return;
    if (preview || !session?.user || !supabase) {
      onComplete(profile);
      return;
    }

    setSaving(true);
    setMessage("");
    const completedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: session.user.id,
        ...profile,
        onboarding_completed: true,
        onboarding_completed_at: completedAt,
        updated_at: completedAt,
      }, { onConflict: "id" })
      .select("id,onboarding_completed")
      .single();

    setSaving(false);
    if (error || !data?.onboarding_completed) {
      setMessage("Your profile could not be confirmed yet. Nothing was lost. Please try once more.");
      return;
    }
    onComplete(profile);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < stages.length - 1) {
      if (canContinue) setStep((current) => current + 1);
      return;
    }
    void finishOrientation();
  }

  return (
    <main className="orientation-shell">
      <aside className="orientation-aside">
        <div className="orientation-brand">
          <span className="orientation-seal" aria-hidden="true">IG</span>
          <div><strong>InnerG Intelligence</strong><span>Agent Academy</span></div>
        </div>

        <div className="orientation-progress" aria-label={`Orientation step ${step + 1} of ${stages.length}`}>
          {stages.map((stage, index) => (
            <div className={index === step ? "orientation-stop active" : index < step ? "orientation-stop complete" : "orientation-stop"} key={stage.number}>
              <span>{index < step ? "✓" : stage.number}</span>
              <div><small>Step {stage.number}</small><strong>{stage.label}</strong></div>
            </div>
          ))}
        </div>

        <blockquote>
          “Direction before automation. Proof before performance.”
          <cite>InnerG Intelligence University</cite>
        </blockquote>
      </aside>

      <section className="orientation-workspace">
        <header className="orientation-header">
          <div><span>{cohort.label}</span><strong>{cohort.code} · {cohort.shortRange}</strong></div>
          <button type="button" onClick={onExit}>Exit safely</button>
        </header>

        <form className="orientation-form" onSubmit={handleSubmit}>
          <div className="orientation-stage" key={step}>
            {step === 0 && (
              <section className="orientation-intro" aria-labelledby="orientation-title">
                <p className="orientation-kicker">Welcome to the academy</p>
                <h1 id="orientation-title">Before the tools,<br /><em>build your direction.</em></h1>
                <p className="orientation-lead">This short orientation turns the next 21 days into your path. You will name who you are, where you are starting, and what you intend to build.</p>
                <div className="orientation-principles">
                  <article><span>01</span><div><strong>One real problem</strong><p>Carry a useful challenge from Day 01 through your final defense.</p></div></article>
                  <article><span>02</span><div><strong>Evidence every week</strong><p>Produce work that can be reviewed, tested, and improved.</p></div></article>
                  <article><span>03</span><div><strong>Human judgment remains</strong><p>Use agents to expand capacity without surrendering responsibility.</p></div></article>
                </div>
                <div className="archivist-note"><b>From The Archivist</b><p>You do not need to know everything before you begin. You need a clear reason to learn.</p></div>
              </section>
            )}

            {step === 1 && (
              <section aria-labelledby="profile-title">
                <p className="orientation-kicker">Step 01 · Scholar profile</p>
                <h1 id="profile-title">Name the person<br /><em>doing the work.</em></h1>
                <p className="orientation-lead">Your profile helps the academy frame examples around your real responsibilities.</p>

                <div className="orientation-field">
                  <label htmlFor="scholar-name">Your name</label>
                  <input id="scholar-name" value={profile.full_name} onChange={(event) => updateProfile("full_name", event.target.value)} autoComplete="name" placeholder="Your full name" required />
                </div>

                <fieldset className="orientation-fieldset">
                  <legend>Which identity best describes your work right now?</legend>
                  <div className="role-grid">
                    {roleOptions.map((option) => (
                      <button type="button" className={profile.scholar_role === option.value ? "choice-card selected" : "choice-card"} aria-pressed={profile.scholar_role === option.value} onClick={() => updateProfile("scholar_role", option.value)} key={option.value}>
                        <SelectionMark selected={profile.scholar_role === option.value} />
                        <strong>{option.label}</strong><small>{option.note}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="orientation-fieldset compact">
                  <legend>What brings you into the academy?</legend>
                  <div className="focus-grid">
                    {focusOptions.map((focus) => (
                      <button type="button" aria-pressed={profile.primary_focus === focus} className={profile.primary_focus === focus ? "focus-choice selected" : "focus-choice"} onClick={() => updateProfile("primary_focus", focus)} key={focus}>
                        <SelectionMark selected={profile.primary_focus === focus} />{focus}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </section>
            )}

            {step === 2 && (
              <section aria-labelledby="readiness-title">
                <p className="orientation-kicker">Step 02 · Readiness</p>
                <h1 id="readiness-title">Start honest.<br /><em>Grow on purpose.</em></h1>
                <p className="orientation-lead">Choose the statement that feels most accurate today. Your baseline changes the guidance, but the standards remain the same for every scholar.</p>
                <div className="experience-list">
                  {experienceOptions.map((option, index) => (
                    <button type="button" className={profile.experience_level === option.value ? "experience-card selected" : "experience-card"} aria-pressed={profile.experience_level === option.value} onClick={() => updateProfile("experience_level", option.value)} key={option.value}>
                      <span className="experience-index">0{index + 1}</span>
                      <div><strong>{option.title}</strong><p>{option.signal}</p><small>{option.guidance}</small></div>
                      <SelectionMark selected={profile.experience_level === option.value} />
                    </button>
                  ))}
                </div>
                <div className="orientation-callout"><strong>Every scholar begins at Level I.</strong><span>Advanced experience may change your speed, but shared foundations make collaboration and evaluation stronger.</span></div>
              </section>
            )}

            {step === 3 && (
              <section aria-labelledby="mission-setup-title">
                <p className="orientation-kicker">Step 03 · Your mission</p>
                <h1 id="mission-setup-title">Choose a problem<br /><em>worth solving.</em></h1>
                <p className="orientation-lead">The strongest capstones begin with repeated work, not a random app idea. Name something real that costs time, clarity, consistency, or opportunity.</p>
                <div className="orientation-field">
                  <label htmlFor="capstone-goal">What repeated problem will you carry through the academy?</label>
                  <textarea id="capstone-goal" value={profile.capstone_goal} onChange={(event) => updateProfile("capstone_goal", event.target.value)} maxLength={420} placeholder="Example: Every week I spend hours researching AI updates and turning them into useful lessons for my community." required />
                  <div className="field-help"><span>Include who receives value and what should improve.</span><b>{profile.capstone_goal.length}/420</b></div>
                </div>
                <fieldset className="orientation-fieldset compact">
                  <legend>Choose a realistic weekly rhythm</legend>
                  <div className="commitment-grid">
                    {commitmentOptions.map((option) => (
                      <button type="button" className={profile.weekly_commitment === option.value ? "commitment-card selected" : "commitment-card"} aria-pressed={profile.weekly_commitment === option.value} onClick={() => updateProfile("weekly_commitment", option.value)} key={option.value}>
                        <SelectionMark selected={profile.weekly_commitment === option.value} />
                        <strong>{option.title}</strong><small>{option.note}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </section>
            )}

            {step === 4 && (
              <section aria-labelledby="roadmap-title">
                <p className="orientation-kicker">Step 04 · Your roadmap</p>
                <h1 id="roadmap-title">Three levels.<br /><em>One working system.</em></h1>
                <p className="orientation-lead">Each level changes your responsibility. First you direct the work, then you build the workflow, then you defend the system. You must score {cohort.passScore}% or higher on every examination to advance.</p>

                <div className="roadmap-grid">
                  {roadmap.map((level) => (
                    <article className={`roadmap-card roadmap-level-${level.level}`} key={level.level}>
                      <header><span>Level {level.level}</span><small>{level.days}</small></header>
                      <h2>{level.name}</h2>
                      <p>{level.promise}</p>
                      <ul>{level.proof.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                  ))}
                </div>

                <div className="scholar-summary">
                  <div className="summary-seal">{profile.full_name.slice(0, 1).toUpperCase() || "S"}</div>
                  <div><span>Founding scholar profile</span><strong>{profile.full_name}</strong><p>{profile.primary_focus} · Starting as an {profile.experience_level}</p></div>
                  <small>{profile.weekly_commitment} rhythm</small>
                </div>
                <blockquote className="capstone-summary">“{profile.capstone_goal}”</blockquote>

                <label className="oath-check">
                  <input type="checkbox" checked={oathAccepted} onChange={(event) => setOathAccepted(event.target.checked)} />
                  <span><b>I accept the Scholar’s Oath.</b>I will build proof, test claims, protect human judgment, and use intelligence to create value.</span>
                </label>
              </section>
            )}
          </div>

          {message && <p className="orientation-message" role="status">{message}</p>}

          <footer className="orientation-actions">
            <button type="button" className="orientation-back" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>← Back</button>
            <div><span>{String(step + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</span><i><b style={{ width: `${((step + 1) / stages.length) * 100}%` }} /></i></div>
            <button type="submit" className="orientation-next" disabled={!canContinue || saving}>
              {step === stages.length - 1 ? (saving ? "Confirming profile…" : "Enter the campus") : step === 0 ? "Begin orientation" : "Continue"}<span aria-hidden="true">→</span>
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
}
