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
        text: "1. Lead creates proposal",
        wrap: true,
      },
      {
        type: "TextBlock",
        text: "2. Proposal is stored in PostgreSQL",
        wrap: true,
      },
      {
        type: "TextBlock",
        text: "3. Employee receives Teams notification",
        wrap: true,
      },
      {
        type: "TextBlock",
        text: "4. Employee acknowledges proposal",
        wrap: true,
      },
      {
        type: "TextBlock",
        text: "5. Lead updates proposal status",
        wrap: true,
      },
      {
        type: "TextBlock",
        text: "6. Proposal is confirmed or rejected",
        wrap: true,
      },

      {
        type: "TextBlock",
        text: "Status Flow",
        weight: "Bolder",
        spacing: "Medium",
      },
      {
        type: "TextBlock",
        text: "Proposed → Interview Requested → Client Reviewing",
        wrap: true,
      },
      {
        type: "TextBlock",
        text: "Client Reviewing → Confirmed / Rejected",
        wrap: true,
      },
    ],
  };
}