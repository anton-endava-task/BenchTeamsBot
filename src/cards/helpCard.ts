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
                type: "TextBlock",
                text: "Employee Commands",
                weight: "Bolder",
                spacing: "Medium",
            },
            {
                type: "FactSet",
                facts: [
                    {
                        title: "my proposals",
                        value: "View your active project proposals.",
                    },
                ],
            },

            {
                type: "TextBlock",
                text: "Lead Commands",
                weight: "Bolder",
                spacing: "Medium",
            },
            {
                type: "FactSet",
                facts: [
                    {
                        title: "bench people",
                        value:
                            "View available bench employees, proposal statistics and quick actions.",
                    },
                    {
                        title: "lead proposals",
                        value: "View proposals for your people.",
                    },
                    {
                        title: "create proposal",
                        value:
                            "Start guided proposal creation with employee, project, role and date selection.",
                    },
                ],
            },

            {
                type: "TextBlock",
                text: "Information",
                weight: "Bolder",
                spacing: "Medium",
            },
            {
                type: "FactSet",
                facts: [
                    {
                        title: "help",
                        value: "Show available commands.",
                    },
                    {
                        title: "workflow",
                        value: "Show staffing workflow lifecycle.",
                    },
                    {
                        title: "guided workflow",
                        value:
                            "Proposal creation uses employee, project, role and date pickers.",
                    },
                ],
            },
        ],

        actions: [
            {
                type: "Action.Submit",
                title: "Bench People",
                data: {
                    action: "command",
                    command: "bench people",
                },
            },
            {
                type: "Action.Submit",
                title: "My Proposals",
                data: {
                    action: "command",
                    command: "my proposals",
                },
            },
            {
                type: "Action.Submit",
                title: "Lead Proposals",
                data: {
                    action: "command",
                    command: "lead proposals",
                },
            },
            {
                type: "Action.Submit",
                title: "Create Proposal",
                data: {
                    action: "command",
                    command: "create proposal",
                },
            },
            {
                type: "Action.Submit",
                title: "Workflow",
                data: {
                    action: "command",
                    command: "workflow",
                },
            },
        ],
    };
}