import { Proposal } from "../models/proposal";

export function createProposalCard(proposal: Proposal) {
  return {
    "$schema": "https://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.5",
    body: [
      {
        type: "TextBlock",
        text: `${proposal.project} (${proposal.status})`,
        weight: "Bolder",
        size: "Large",
        color: getStatusColor(proposal.status),
    },
      {
        type: "FactSet",
        facts: [
          { title: "Project", value: proposal.project },
          { title: "Role", value: proposal.role },
          { title: "Status", value: proposal.status },
          { title: "Expected Update", value: proposal.expectedUpdate },
          { title: "Owner", value: proposal.owner },
          { title: "Acknowledged", value: proposal.acknowledged ? "Yes ✅" : "No",},
        ],
      },
    ],
    actions: proposal.acknowledged
  ? []
  : [
      {
        type: "Action.Submit",
        title: "Acknowledge",
        data: {
          action: "acknowledge",
          proposalId: proposal.id,
          project: proposal.project,
        },
      },
      {
        type: "Action.OpenUrl",
        title: "Contact Lead",
        url: "https://teams.microsoft.com",
      },
    ],
  };
}

function getStatusColor(status: string): string {
  switch (status) {
    case "Confirmed":
      return "Good";

    case "Rejected":
      return "Attention";

    case "Interview Requested":
      return "Warning";

    default:
      return "Accent";
  }
}