export type CreateProposalStep =
  | "select-employee"
  | "enter-project"
  | "enter-role"
  | "enter-expected-update";

export type CreateProposalSession = {
  step: CreateProposalStep;
  benchPersonId?: string;
  project?: string;
  role?: string;
  expectedUpdate?: string;
};