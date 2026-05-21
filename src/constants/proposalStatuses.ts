export const ProposalStatus = {
  Proposed: "Proposed",
  InterviewRequested: "Interview Requested",
  ClientReviewing: "Client Reviewing",
  Confirmed: "Confirmed",
  Rejected: "Rejected",
} as const;

export type ProposalStatus =
  (typeof ProposalStatus)[keyof typeof ProposalStatus];
