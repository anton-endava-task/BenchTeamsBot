export async function sendAdaptiveCard(
  context: any,
  card: any
): Promise<void> {
  await context.send({
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: card,
      },
    ],
  });
}

export async function sendAdaptiveCards(
  context: any,
  cards: any[]
): Promise<void> {
  await context.send({
    type: "message",
    attachments: cards.map((card) => ({
      contentType: "application/vnd.microsoft.card.adaptive",
      content: card,
    })),
  });
}