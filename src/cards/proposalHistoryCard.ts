export function createProposalHistoryCard(
    proposalId: string,
    history: any[]
) {
    return {
        $schema: "https://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.5",

        body: [
            {
                type: "TextBlock",
                text: "Proposal History",
                weight: "Bolder",
                size: "Large",
            },
            {
                type: "TextBlock",
                text: `Proposal ID: ${proposalId}`,
                isSubtle: true,
                wrap: true,
            },
            ...history.map((item) => ({
                type: "FactSet",
                facts: [
                    {
                        title: "Event",
                        value: item.event_type,
                    },
                    {
                        title: "Change",
                        value: `${item.old_status ?? "None"} → ${item.new_status}`,
                    },
                    {
                        title: "Changed By",
                        value: item.changed_by_name ?? item.changed_by ?? "Unknown",
                    },
                    {
                        title: "Changed At",
                        value: new Date(item.changed_at).toLocaleString(),
                    },
                ],
            })),
        ],
    };
}