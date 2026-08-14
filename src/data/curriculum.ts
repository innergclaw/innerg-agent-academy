export type Lesson = {
  day: number;
  level: 1 | 2 | 3;
  levelName: "Operator" | "Builder" | "Architect";
  title: string;
  objective: string;
  mission: string;
  evidence: string;
  minutes: number;
  kind: "lesson" | "checkpoint" | "capstone";
};

export const lessons: Lesson[] = [
  { day: 1, level: 1, levelName: "Operator", title: "From Prompts to Agents", objective: "Recognize the difference between a one-time answer and a repeatable agent workflow.", mission: "Identify three repeatable problems in your life, work, school, or business. Choose one to carry through the academy.", evidence: "Agent Opportunity Map", minutes: 35, kind: "lesson" },
  { day: 2, level: 1, levelName: "Operator", title: "Define the Outcome", objective: "Set the user, result, inputs, boundaries, and finish line before touching a tool.", mission: "Write an Outcome Contract for your chosen problem.", evidence: "Outcome Contract", minutes: 40, kind: "lesson" },
  { day: 3, level: 1, levelName: "Operator", title: "Reliable Prompt Structure", objective: "Use role, context, task, constraints, output, and checks with intention.", mission: "Repair one weak prompt and annotate what changed.", evidence: "Before-and-after prompt", minutes: 35, kind: "lesson" },
  { day: 4, level: 1, levelName: "Operator", title: "Context and Boundaries", objective: "Give an agent what it needs without creating noise or hidden assumptions.", mission: "Create a reusable Context Pack and explicit non-goals.", evidence: "Context Pack", minutes: 40, kind: "lesson" },
  { day: 5, level: 1, levelName: "Operator", title: "Verification and Uncertainty", objective: "Separate facts, assumptions, inferences, and open questions.", mission: "Research one important claim and preserve the verification trail.", evidence: "Source and uncertainty log", minutes: 45, kind: "lesson" },
  { day: 6, level: 1, levelName: "Operator", title: "Turn Tasks into Workflows", objective: "Organize work into visible stages with a clear finish condition.", mission: "Map a five-to-seven-step workflow.", evidence: "Workflow diagram", minutes: 45, kind: "lesson" },
  { day: 7, level: 1, levelName: "Operator", title: "Operator Examination", objective: "Prove that you can direct intelligence before adding more tools.", mission: "Complete the examination and critique an unreliable agent response.", evidence: "Checkpoint I", minutes: 35, kind: "checkpoint" },
  { day: 8, level: 2, levelName: "Builder", title: "Break Work into Jobs", objective: "Define the input, action, output, and owner for each stage.", mission: "Decompose your capstone into manageable tasks.", evidence: "Task map", minutes: 45, kind: "lesson" },
  { day: 9, level: 2, levelName: "Builder", title: "Tools and Permissions", objective: "Choose tools by function and limit their authority with intention.", mission: "Map tools, permissions, and approval gates.", evidence: "Tool and permission map", minutes: 40, kind: "lesson" },
  { day: 10, level: 2, levelName: "Builder", title: "The Research Agent", objective: "Collect and synthesize information while preserving sources.", mission: "Produce a sourced research brief.", evidence: "Research brief", minutes: 55, kind: "lesson" },
  { day: 11, level: 2, levelName: "Builder", title: "The Communication Agent", objective: "Turn one source into a repeatable, reviewed deliverable.", mission: "Build and run a communication or content workflow.", evidence: "Reviewed deliverable", minutes: 55, kind: "lesson" },
  { day: 12, level: 2, levelName: "Builder", title: "Memory and Context Hygiene", objective: "Decide what should persist, refresh, expire, or stay private.", mission: "Write memory rules for your workflow.", evidence: "Memory rules", minutes: 35, kind: "lesson" },
  { day: 13, level: 2, levelName: "Builder", title: "Test, Debug, Recover", objective: "Use failure as evidence for improving the system.", mission: "Run three tests and document your corrections.", evidence: "Test and repair log", minutes: 55, kind: "lesson" },
  { day: 14, level: 2, levelName: "Builder", title: "Builder Examination", objective: "Demonstrate a repeatable workflow and explain your repair decisions.", mission: "Submit the repaired workflow and examination.", evidence: "Checkpoint II", minutes: 40, kind: "checkpoint" },
  { day: 15, level: 3, levelName: "Architect", title: "The System Specification", objective: "Document the system so another person can understand and test it.", mission: "Write the complete capstone agent brief.", evidence: "Agent specification", minutes: 50, kind: "lesson" },
  { day: 16, level: 3, levelName: "Architect", title: "Human-in-the-Loop", objective: "Keep consequential judgment and approvals human-owned.", mission: "Add approval gates and escalation rules.", evidence: "Human oversight map", minutes: 40, kind: "lesson" },
  { day: 17, level: 3, levelName: "Architect", title: "Quality and Evaluations", objective: "Measure whether the workflow is useful, accurate, and complete.", mission: "Create a scoring rubric and five pass-or-fail tests.", evidence: "Evaluation set", minutes: 50, kind: "lesson" },
  { day: 18, level: 3, levelName: "Architect", title: "Privacy, Safety, Ownership", objective: "Identify data, reputation, and permission risks before release.", mission: "Complete a risk review and correct critical issues.", evidence: "Risk checklist", minutes: 45, kind: "lesson" },
  { day: 19, level: 3, levelName: "Architect", title: "Capstone Build", objective: "Assemble a functional first version of your system.", mission: "Build and document version one.", evidence: "Capstone V1", minutes: 90, kind: "capstone" },
  { day: 20, level: 3, levelName: "Architect", title: "Test and Rehearse", objective: "Improve the workflow with evidence and prepare a concise demonstration.", mission: "Run the evaluation set, revise, and record a three-minute demo.", evidence: "Capstone V2 and demo", minutes: 90, kind: "capstone" },
  { day: 21, level: 3, levelName: "Architect", title: "The Final Defense", objective: "Explain the value, limitations, human role, and next step.", mission: "Submit your final package and next-30-days plan.", evidence: "Checkpoint III and final capstone", minutes: 60, kind: "checkpoint" },
];

export const levels = [
  { id: 1, roman: "I", name: "Operator", promise: "Direct intelligence with clarity." },
  { id: 2, roman: "II", name: "Builder", promise: "Assemble and test the workflow." },
  { id: 3, roman: "III", name: "Architect", promise: "Design a dependable system." },
] as const;

