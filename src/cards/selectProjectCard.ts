export function createSelectProjectCard(projects: any[]) {
    return {
        $schema: "https://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.5",

        body: [
            {
                type: "TextBlock",
                text: "Select Project",
                weight: "Bolder",
                size: "Large",
            },
            {
                type: "Input.ChoiceSet",
                id: "projectName",
                style: "compact",
                isRequired: true,
                errorMessage: "Please select a project.",
                choices: projects.map((project) => ({
                    title: project.name,
                    value: project.name,
                })),
            },
        ],

        actions: [
            {
                type: "Action.Submit",
                title: "Continue",
                data: {
                    action: "select-project",
                },
            },
        ],
    };
}