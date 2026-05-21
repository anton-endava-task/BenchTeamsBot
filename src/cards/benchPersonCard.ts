export function createBenchPersonCard(person: any) {
  return {
    $schema: "https://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.5",
    body: [
      {
        type: "TextBlock",
        text: person.name,
        weight: "Bolder",
        size: "Large",
      },
      {
        type: "FactSet",
        facts: [
          { title: "Discipline", value: person.discipline },
          { title: "Status", value: person.bench_status },
          {
            title: "Active Proposals",
            value: String(person.active_proposals ?? 0),
          },
          {
            title: "Days on Bench",
            value: getDaysSince(person.bench_since),
          },
          {
            title: "Stale Proposals",
            value: getStaleIndicator(Number(person.stale_proposals ?? 0)),
          },
          {
            title: "Last Proposal Update",
            value: person.last_proposal_update
                ? getDaysSince(person.last_proposal_update) + " ago"
                : "No proposals yet",
          },
        ],
      },
    ],
    actions: [
      {
        type: "Action.Submit",
        title: "Create Proposal",
        data: {
          action: "create-proposal-for-person",
          benchPersonId: person.id,
        },
      },
      {
        type: "Action.OpenUrl",
        title: "Open Teams Chat",
        url: "https://teams.microsoft.com",
      },
    ],
  };
}

function getDaysSince(date?: string): string {
  if (!date) {
    return "Unknown";
  }

  const diffMs = new Date().getTime() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return `${diffDays} days`;
}

function getStaleIndicator(count: number): string {
  if (count > 0) {
    return `${count} stale ⚠️`;
  }

  return "0 ✅";
}