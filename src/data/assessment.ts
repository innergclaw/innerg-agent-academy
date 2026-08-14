export type CheckpointQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
};

export const checkpointQuestions: Record<number, CheckpointQuestion[]> = {
  7: [
    {
      id: "operator-outcome",
      prompt: "What should be clear before you choose an AI tool?",
      options: ["The desired outcome, user, boundaries, and finish line", "The most popular model", "The longest possible prompt"],
      answer: 0,
    },
    {
      id: "operator-uncertainty",
      prompt: "A dependable operator separates research into which categories?",
      options: ["Fast and slow", "Facts, assumptions, inferences, and open questions", "Public and private opinions"],
      answer: 1,
    },
    {
      id: "operator-workflow",
      prompt: "What turns a useful prompt into a repeatable workflow?",
      options: ["More adjectives", "A visible sequence with inputs, checks, and a finish condition", "Removing human review"],
      answer: 1,
    },
  ],
  14: [
    {
      id: "builder-permissions",
      prompt: "How much authority should an agent receive?",
      options: ["Only the access required for its assigned job", "Full access so it never gets blocked", "Whatever the newest tool recommends"],
      answer: 0,
    },
    {
      id: "builder-research",
      prompt: "What makes an agent research brief reviewable?",
      options: ["A confident tone", "Preserved sources and visible uncertainty", "A longer summary"],
      answer: 1,
    },
    {
      id: "builder-debug",
      prompt: "What is the strongest response to a failed agent run?",
      options: ["Hide the failure", "Replace every tool", "Document the failure, isolate the cause, repair, and retest"],
      answer: 2,
    },
  ],
  21: [
    {
      id: "architect-human",
      prompt: "Where should consequential judgment remain?",
      options: ["With a clearly assigned human reviewer", "Inside an unsupervised automation", "Wherever the process is fastest"],
      answer: 0,
    },
    {
      id: "architect-evaluation",
      prompt: "What proves that an agent system is dependable?",
      options: ["A polished demo", "Repeatable tests tied to the intended outcome", "The number of tools connected"],
      answer: 1,
    },
    {
      id: "architect-defense",
      prompt: "A complete final defense must explain value, limitations, human responsibility, and what else?",
      options: ["The next test or improvement", "A promise of perfect accuracy", "Why competitors are wrong"],
      answer: 0,
    },
  ],
};
