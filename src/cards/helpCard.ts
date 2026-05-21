export function createHelpCard() {
  return {
    $schema: "https://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.5",
    body: [
      {
        type: "TextBlock",
        text: "Bench Bot Commands",
        weight: "Bolder",
        size: "Large",
      },
      {
        type: "FactSet",
        facts: [
          {
            title: "my proposals",
            value: "View your active project proposals.",
          },
          {
            title: "lead proposals",
            value: "View proposals for people assigned to you as lead.",
          },
          {
            title: "create proposal",
            value: "Create a sample proposal and notify the employee.",
          },
          {
            title: "help",
            value: "Show this command list.",
          },
        ],
      },
    ],
  };
}