export type CreateProposalStep =
  | "select-employee"
  | "select-project"
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