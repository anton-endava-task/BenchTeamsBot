import {
    getProposalsForLead,
    updateProposalStatus,
    getBenchPeopleForLead,
} from "../services/proposalService";

import { createLeadProposalCard } from "../cards/leadProposalCard";
import { createBenchPersonCard } from "../cards/benchPersonCard";
import { sendAdaptiveCard, sendAdaptiveCards } from "../utils/sendAdaptiveCard";

export async function handleUpdateProposalStatus(
    context: any,
    proposalId: string,
    status: string,
    changedBy: string
): Promise<void> {
    const proposal = await updateProposalStatus(proposalId, status, changedBy);

    if (!proposal) {
        await context.send("Proposal not found.");
        return;
    }

    await sendAdaptiveCard(context, createLeadProposalCard(proposal));
}

export async function handleLeadProposals(
    context: any,
    aadObjectId: string
): Promise<void> {
    const proposals = await getProposalsForLead(aadObjectId);

    if (!proposals.length) {
        await context.send("No proposals found for your lead view.");
        return;
    }

    await sendAdaptiveCards(
        context,
        proposals.map((proposal) => createLeadProposalCard(proposal))
    );
}

export async function handleBenchPeople(
    context: any,
    aadObjectId: string
): Promise<void> {
    const people = await getBenchPeopleForLead(aadObjectId);

    if (!people.length) {
        await context.send("No bench people found.");
        return;
    }

    await sendAdaptiveCards(
        context,
        people.map((person) => createBenchPersonCard(person))
    );
}