import { Proposal } from "../models/proposal";

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

export function createLeadProposalCard(proposal: any) {
  return {
    $schema: "https://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.5",

    body: [
      {
        type: "TextBlock",
        text: `${proposal.employee_name} → ${proposal.project}`,
        weight: "Bolder",
        size: "Large",
        color: getStatusColor(proposal.status),
      },

      {
        type: "FactSet",
        facts: [
          {
            title: "Discipline",
            value: proposal.discipline || "N/A",
          },
          {
            title: "Role",
            value: proposal.role,
          },
          {
            title: "Status",
            value: proposal.status,
          },
          {
            title: "Last Updated",
            value: getStaleStatus(proposal.updatedAt),
        },
          {
            title: "Expected Update",
            value: proposal.expectedUpdate,
          },
          {
            title: "Owner",
            value: proposal.owner,
          },
          {
            title: "Acknowledged",
            value: proposal.acknowledged ? "Yes ✅" : "No",
          },
        ],
      },
    ],

    actions: getStatusActions(proposal),
  };
}

function getStaleStatus(updatedAt?: string): string {
  if (!updatedAt) {
    return "Unknown";
  }

  const updatedDate = new Date(updatedAt);
  const now = new Date();

  const diffMs = now.getTime() - updatedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays >= 14) {
    return `${diffDays} days old 🔴`;
  }

  if (diffDays >= 7) {
    return `${diffDays} days old 🟡`;
  }

  return `${diffDays} days old ✅`;
}

function getStatusActions(proposal: any) {
  if (proposal.status === "Proposed") {
    return [
        createStatusAction(proposal.id, "Interview Requested", "Request Interview"),
        createStatusAction(proposal.id, "Client Reviewing", "Move to Client Reviewing"),
        createStatusAction(proposal.id, "Rejected", "Reject"),
    ];
}

  if (proposal.status === "Interview Requested") {
    return [
      createStatusAction(proposal.id, "Client Reviewing", "Move to Client Reviewing"),
      createStatusAction(proposal.id, "Rejected", "Reject"),
    ];
  }

  if (proposal.status === "Client Reviewing") {
    return [
      createStatusAction(proposal.id, "Confirmed", "Confirm"),
      createStatusAction(proposal.id, "Rejected", "Reject"),
    ];
  }

  return [];
}

function createStatusAction(
  proposalId: string,
  status: string,
  title: string
) {
  return {
    type: "Action.Submit",
    title,
    data: {
      action: "update-status",
      proposalId,
      status,
    },
  };
}