export function createSelectExpectedUpdateCard() {
    return {
        $schema: "https://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.5",

        body: [
            {
                type: "TextBlock",
                text: "Select Expected Update Date",
                weight: "Bolder",
                size: "Large",
            },
            {
                type: "Input.Date",
                id: "expectedUpdate",
                isRequired: true,
                errorMessage: "Please select expected update date.",
            },
        ],

        actions: [
            {
                type: "Action.Submit",
                title: "Create Proposal",
                data: {
                    action: "select-expected-update",
                },
            },
        ],
    };
}