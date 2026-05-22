import { acknowledgeProposal, getProposalsForUser } from "../services/proposalService";
import { createProposalCard } from "../cards/proposalCard";
import { sendAdaptiveCard, sendAdaptiveCards } from "../utils/sendAdaptiveCard";

export async function handleAcknowledgeProposal(
    context: any,
    proposalId: string
): Promise<void> {
    const proposal = await acknowledgeProposal(proposalId);

    if (!proposal) {
        await context.send("Proposal not found.");
        return;
    }

    await sendAdaptiveCard(context, createProposalCard(proposal));
}

export async function handleMyProposals(
    context: any,
    aadObjectId: string
): Promise<void> {
    const proposals = await getProposalsForUser(aadObjectId);

    await sendAdaptiveCards(
        context,
        proposals.map((proposal) => createProposalCard(proposal))
    );
}