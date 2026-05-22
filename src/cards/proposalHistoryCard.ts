function formatDate(value: string): string {
    return new Date(value).toLocaleString();
}

function formatChange(item: any): string {
    if (item.event_type === "ProposalCreated") {
        return `Created with status ${item.new_status}`;
    }

    return `${item.old_status ?? "None"} → ${item.new_status}`;
}

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
                text: "Proposal Timeline",
                weight: "Bolder",
                size: "Large",
            },
            {
                type: "TextBlock",
                text: `Proposal ID: ${proposalId}`,
                isSubtle: true,
                wrap: true,
            },

            ...history.flatMap((item, index) => {
                const blocks: any[] = [];

                if (index > 0) {
                    blocks.push({
                        type: "TextBlock",
                        text: "↓",
                        spacing: "Small",
                        weight: "Bolder",
                    });
                }

                blocks.push({
                    type: "Container",
                    spacing: "Medium",
                    items: [
                        {
                            type: "TextBlock",
                            text: `● ${formatEventType(item.event_type)}`,
                            weight: "Bolder",
                            wrap: true,
                        },
                        {
                            type: "TextBlock",
                            text: formatChange(item),
                            wrap: true,
                        },
                        {
                            type: "TextBlock",
                            text: `By: ${item.changed_by_name ?? item.changed_by ?? "Unknown"}`,
                            isSubtle: true,
                            wrap: true,
                        },
                        {
                            type: "TextBlock",
                            text: formatDate(item.changed_at),
                            isSubtle: true,
                            wrap: true,
                            spacing: "None",
                        },
                    ],
                });

                return blocks;
            }),
        ],
    };
}

function formatEventType(eventType: string): string {
    switch (eventType) {
        case "ProposalCreated":
            return "Proposal Created";

        case "StatusChanged":
            return "Status Updated";

        default:
            return eventType;
    }
}