export type CreateProposalStep =
    | "select-employee"
    | "select-project"
    | "select-role"
    | "select-expected-update"
    | "enter-new-project"
    | "enter-new-role";

export type CreateProposalSession = {
  step: CreateProposalStep;
  benchPersonId?: string;
  project?: string;
  role?: string;
  expectedUpdate?: string;
};