export function createSelectRoleCard(roles: any[]) {
    return {
        $schema: "https://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.5",

        body: [
            {
                type: "TextBlock",
                text: "Select Role",
                weight: "Bolder",
                size: "Large",
            },
            {
                type: "Input.ChoiceSet",
                id: "roleName",
                style: "compact",
                isRequired: true,
                errorMessage: "Please select a role.",
                choices: roles.map((role) => ({
                    title: role.name,
                    value: role.name,
                })),
            },
        ],

        actions: [
            {
                type: "Action.Submit",
                title: "Continue",
                data: {
                    action: "select-role",
                },
            },
        ],
    };
}