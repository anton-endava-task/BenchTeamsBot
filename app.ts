import { stripMentionsText, TokenCredentials } from "@microsoft/teams.api";
import { App } from "@microsoft/teams.apps";
import { LocalStorage } from "@microsoft/teams.common";
import { ManagedIdentityCredential } from "@azure/identity";

import config from "./config";

import {
  getProposalsForUser,
  acknowledgeProposal,
  getProposalsForLead,
  updateProposalStatus,
  createProposal,
  saveUserConversation,
  getConversationIdForProposal,
  getBenchPeople,
  getBenchPeopleForLead,
} from "./src/services/proposalService";

import { createProposalCard } from "./src/cards/proposalCard";
import { createLeadProposalCard } from "./src/cards/leadProposalCard";

import {
  sendAdaptiveCard,
  sendAdaptiveCards,
} from "./src/utils/sendAdaptiveCard";

import { Commands } from "./src/constants/commands";
import { createHelpCard } from "./src/cards/helpCard";
import { createWorkflowCard } from "./src/cards/workflowCard";
import { createSelectEmployeeCard } from "./src/cards/selectEmployeeCard";
import { createBenchPersonCard } from "./src/cards/benchPersonCard";

const storage = new LocalStorage();

const createTokenFactory = () => {
  return async (scope: string | string[], tenantId?: string): Promise<string> => {
    const managedIdentityCredential = new ManagedIdentityCredential({
      clientId: process.env.CLIENT_ID,
    });

    const scopes = Array.isArray(scope) ? scope : [scope];

    const tokenResponse = await managedIdentityCredential.getToken(scopes, {
      tenantId,
    });

    return tokenResponse.token;
  };
};

const tokenCredentials: TokenCredentials = {
  clientId: process.env.CLIENT_ID || "",
  token: createTokenFactory(),
};

const credentialOptions =
  config.MicrosoftAppType === "UserAssignedMsi"
    ? { ...tokenCredentials }
    : undefined;

const app = new App({
  ...credentialOptions,
  storage,
});

interface ConversationState {
  count: number;
}

const getConversationState = (conversationId: string): ConversationState => {
  let state = storage.get(conversationId);

  if (!state) {
    state = { count: 0 };
    storage.set(conversationId, state);
  }

  return state;
};

const createProposalSessions = new Map<string, any>();

app.on("message", async (context) => {
  const activity = context.activity;
  const text: string = stripMentionsText(activity);
  const value = activity.value as any;
  const commandFromCard = value?.action === "command" ? value.command : undefined;
  const normalizedText = commandFromCard ?? text;

  const aadObjectId = (activity.from as any).aadObjectId;
  const conversationId = activity.conversation.id;

  if (aadObjectId && conversationId) {
    await saveUserConversation(aadObjectId, conversationId);
  }

  const createProposalSession = createProposalSessions.get(conversationId);

  if (createProposalSession) {
    if (createProposalSession.step === "enter-project") {
      createProposalSession.project = normalizedText;
      createProposalSession.step = "enter-role";

      createProposalSessions.set(conversationId, createProposalSession);

      await context.send("What role is this proposal for?");
      return;
    }

    if (createProposalSession.step === "enter-role") {
      createProposalSession.role = normalizedText;
      createProposalSession.step = "enter-expected-update";

      createProposalSessions.set(conversationId, createProposalSession);

      await context.send("When is the expected next update?");
      return;
    }

    if (createProposalSession.step === "enter-expected-update") {
      createProposalSession.expectedUpdate = normalizedText;

      await context.send(
        `Creating proposal for ${createProposalSession.project}...`
      );

      createProposalSessions.delete(conversationId);

      const proposal = await createProposal({
        benchPersonId: createProposalSession.benchPersonId,
        leadAadObjectId: aadObjectId,
        project: createProposalSession.project,
        role: createProposalSession.role,
        expectedUpdate: createProposalSession.expectedUpdate,
        owner: "Ivan Petrov",
      });

      if (!proposal) {
        await context.send("Failed to create proposal.");
        createProposalSessions.delete(conversationId);
        return;
      }

      const targetConversationId = await getConversationIdForProposal(proposal.id);

      await context.send(`Proposal created for project ${proposal.project}.`);

      if (targetConversationId) {
        await (context.api as any).conversations._activities.create(
          targetConversationId,
          {
            type: "message",
            attachments: [
              {
                contentType: "application/vnd.microsoft.card.adaptive",
                content: createProposalCard(proposal),
              },
            ],
          }
        );
      } else {
        await context.send("Employee conversation not found. Notification was not sent.");
      }

      createProposalSessions.delete(conversationId);
      return;
    }
  }

  if (value?.action === "create-proposal-for-person") {
    createProposalSessions.set(conversationId, {
      step: "enter-project",
      benchPersonId: value.benchPersonId,
    });

    await context.send("What project should this proposal be for?");
    return;
  }

  if (value?.action === "update-status") {

    await context.send(
      "What project should this proposal be for?"
    );

    return;
  }

  if (value?.action === "acknowledge") {
    const proposal = await acknowledgeProposal(value.proposalId);

    if (!proposal) {
      await context.send("Proposal not found.");
      return;
    }

    await sendAdaptiveCard(context, createProposalCard(proposal));
    return;
  }

  if (value?.action === "update-status") {
    const proposal = await updateProposalStatus(
      value.proposalId,
      value.status,
      aadObjectId
    );

    if (!proposal) {
      await context.send("Proposal not found.");
      return;
    }

    await sendAdaptiveCard(context, createLeadProposalCard(proposal));
    return;
  }

  if (text === "/reset") {
    storage.delete(activity.conversation.id);
    await context.send("Ok I've deleted the current conversation state.");
    return;
  }

if (text === "my proposals") {

  if (text === "/diag") {
    await context.send(JSON.stringify(activity));
    return;
  }

  if (text === "/state") {
    const state = getConversationState(activity.conversation.id);
    await context.send(JSON.stringify(state));
    return;
  }

  if (text === "/runtime") {
    const runtime = {
      nodeversion: process.version,
      sdkversion: "2.0.0",
    };

    await context.send(JSON.stringify(runtime));
    return;
  }

if (text === "lead proposals") {

    await sendAdaptiveCards(
      context,
      proposals.map((proposal) => createProposalCard(proposal))
    );

    return;
  }

  if (normalizedText  === Commands.LeadProposals) {
    const proposals = await getProposalsForLead(aadObjectId);

    if (!proposals.length) {
      await context.send("No proposals found for your lead view.");
      return;
    }

    await sendAdaptiveCards(
      context,
      proposals.map((proposal) => createLeadProposalCard(proposal))
    );

  if (!proposal) {
    await context.send("Failed to create proposal.");
    return;
  }

  const conversationId = await getConversationIdForProposal(proposal.id);

  console.log("Would proactively notify conversation:", conversationId);

  console.log(
    "activities prototype:",
    Object.getOwnPropertyNames(
      Object.getPrototypeOf((context.api as any).conversations._activities)
    )
  );

  console.log(
    "create fn:",
    (context.api as any).conversations._activities.create.toString()
  );

  await context.send(`Proposal created for project ${proposal.project}.`);

  if (conversationId) {
    await (context.api as any).conversations._activities.create(
      conversationId,
      {
        type: "message",
        attachments: [
          {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: createProposalCard(proposal),
          },
        ],
      }
    );
  }

    if (!people.length) {
      await context.send("No bench people found.");
      return;
    }

    await sendAdaptiveCards(
      context,
      people.map((person) => createBenchPersonCard(person))
    );

    return;
  }

  await context.send("I didn't recognize that command. Try typing `help`.");
});

export default app;