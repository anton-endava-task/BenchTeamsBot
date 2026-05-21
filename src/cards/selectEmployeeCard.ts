export function createSelectEmployeeCard(employees: any[]) {
  return {
    $schema: "https://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.5",

    body: [
      {
        type: "TextBlock",
        text: "Select Employee",
        weight: "Bolder",
        size: "Large",
      },
    ],

    actions: employees.map((employee) => ({
      type: "Action.Submit",
      title: employee.name,
      data: {
        action: "select-employee",
        employeeId: employee.id,
      },
    })),
  };
}