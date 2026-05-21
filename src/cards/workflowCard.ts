export function createWorkflowCard() {
  return {
    $schema: "https://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.5",

    body: [
      {
        type: "TextBlock",
        text: "Proposal Workflow",
        weight: "Bolder",
        size: "Large",
      },

      {
        type: "TextBlock",
        text:
          "Lead creates proposal\n↓\nProposal stored in PostgreSQL\n↓\nEmployee receives Teams notification\n↓\nEmployee acknowledges proposal\n↓\nLead updates proposal status\n↓\nProposal confirmed or rejected",
        wrap: true,
        spacing: "Medium",
      },

      {
        type: "FactSet",
        facts: [
          {
            title: "Statuses",
            value:
              "Proposed → Interview Requested → Client Reviewing → Confirmed / Rejected",
          },
        ],
      },
    ],
  };
}