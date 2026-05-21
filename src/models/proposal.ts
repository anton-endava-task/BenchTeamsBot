export type Proposal = {
  project: string;
  role: string;
  status: string;
  expectedUpdate: string;
  owner: string;
  id: string;
  acknowledged?: boolean;
};
