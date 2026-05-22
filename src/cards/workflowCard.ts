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
            "The workflow starts from the bench dashboard and guides the lead through proposal creation and lifecycle management.",
        wrap: true,
        spacing: "Medium",
      },

      {
        type: "TextBlock",
        text: "Workflow Steps",
        weight: "Bolder",
        spacing: "Medium",
      },

      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "1. Open Bench Dashboard",
            weight: "Bolder",
          },
          {
            type: "TextBlock",
            text:
                "Lead opens the bench dashboard and reviews available employees.",
            wrap: true,
            spacing: "None",
          },
        ],
      },

      {
        type: "TextBlock",
        text: "↓",
        spacing: "Small",
      },

      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "2. Select Employee",
            weight: "Bolder",
          },
          {
            type: "TextBlock",
            text:
                "Lead selects a bench employee using Adaptive Card actions.",
            wrap: true,
            spacing: "None",
          },
        ],
      },

      {
        type: "TextBlock",
        text: "↓",
        spacing: "Small",
      },

      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "3. Select Project",
            weight: "Bolder",
          },
          {
            type: "TextBlock",
            text:
                "Project is selected from active projects using dropdown selection.",
            wrap: true,
            spacing: "None",
          },
        ],
      },

      {
        type: "TextBlock",
        text: "↓",
        spacing: "Small",
      },

      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "4. Select Role",
            weight: "Bolder",
          },
          {
            type: "TextBlock",
            text:
                "Role is selected from reference data using dropdown selection.",
            wrap: true,
            spacing: "None",
          },
        ],
      },

      {
        type: "TextBlock",
        text: "↓",
        spacing: "Small",
      },

      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "5. Select Expected Update Date",
            weight: "Bolder",
          },
          {
            type: "TextBlock",
            text:
                "Lead selects the expected update date using Adaptive Card date picker.",
            wrap: true,
            spacing: "None",
          },
        ],
      },

      {
        type: "TextBlock",
        text: "↓",
        spacing: "Small",
      },

      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "6. Proposal Created",
            weight: "Bolder",
          },
          {
            type: "TextBlock",
            text:
                "Proposal is stored in PostgreSQL and audit history is recorded.",
            wrap: true,
            spacing: "None",
          },
        ],
      },

      {
        type: "TextBlock",
        text: "↓",
        spacing: "Small",
      },

      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "7. Employee Notification",
            weight: "Bolder",
          },
          {
            type: "TextBlock",
            text:
                "Employee receives proactive Teams notification with proposal details.",
            wrap: true,
            spacing: "None",
          },
        ],
      },

      {
        type: "TextBlock",
        text: "↓",
        spacing: "Small",
      },

      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "8. Proposal Lifecycle",
            weight: "Bolder",
          },
          {
            type: "TextBlock",
            text:
                "Lead updates proposal statuses and employees acknowledge proposals.",
            wrap: true,
            spacing: "None",
          },
        ],
      },

      {
        type: "TextBlock",
        text: "Status Flow",
        weight: "Bolder",
        spacing: "Medium",
      },

      {
        type: "TextBlock",
        text:
            "Proposed → Interview Requested → Client Reviewing → Confirmed / Rejected",
        wrap: true,
      },
    ],
  };
}