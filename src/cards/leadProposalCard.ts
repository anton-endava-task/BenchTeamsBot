import { Proposal } from "../models/proposal";
import { ProposalStatus } from "../constants/proposalStatuses";

function getStatusColor(status: string): string {
  switch (status) {
    case ProposalStatus.Confirmed:
      return "Good";

    case ProposalStatus.Rejected:
      return "Attention";

    case ProposalStatus.InterviewRequested:
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
  if (proposal.status === ProposalStatus.Proposed) {
    return [
      createStatusAction(
        proposal.id,
        ProposalStatus.InterviewRequested,
        "Request Interview"
      ),

      createStatusAction(
        proposal.id,
        ProposalStatus.ClientReviewing,
        "Move to Client Reviewing"
      ),

      createStatusAction(
        proposal.id,
        ProposalStatus.Rejected,
        "Reject"
      ),
    ];
  }

  if (proposal.status === ProposalStatus.InterviewRequested) {
    return [
      createStatusAction(
        proposal.id,
        ProposalStatus.ClientReviewing,
        "Move to Client Reviewing"
      ),

      createStatusAction(
        proposal.id,
        ProposalStatus.Rejected,
        "Reject"
      ),
    ];
  }

  if (proposal.status === ProposalStatus.ClientReviewing) {
    return [
      createStatusAction(
        proposal.id,
        ProposalStatus.Confirmed,
        "Confirm"
      ),

      createStatusAction(
        proposal.id,
        ProposalStatus.Rejected,
        "Reject"
      ),
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