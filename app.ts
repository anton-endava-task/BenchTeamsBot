import { stripMentionsText, TokenCredentials } from "@microsoft/teams.api";
import { App } from "@microsoft/teams.apps";
import { LocalStorage } from "@microsoft/teams.common";
import config from "./config";
import { ManagedIdentityCredential } from "@azure/identity";
import {
  getProposalsForUser,
  acknowledgeProposal,
  getProposalsForLead,
  updateProposalStatus,
  createProposal,
  saveUserConversation,
  getConversationIdForProposal,
} from "./src/services/proposalService";
import { createProposalCard } from "./src/cards/proposalCard";
import { createLeadProposalCard } from "./src/cards/leadProposalCard";

// Create storage for conversation history
const storage = new LocalStorage();

const createTokenFactory = () => {
  return async (scope: string | string[], tenantId?: string): Promise<string> => {
    const managedIdentityCredential = new ManagedIdentityCredential({
      clientId: process.env.CLIENT_ID,
    });
    const scopes = Array.isArray(scope) ? scope : [scope];
    const tokenResponse = await managedIdentityCredential.getToken(scopes, {
      tenantId: tenantId,
    });

    return tokenResponse.token;
  };
};

// Configure authentication using TokenCredentials
const tokenCredentials: TokenCredentials = {
  clientId: process.env.CLIENT_ID || "",
  token: createTokenFactory(),
};

const credentialOptions =
  config.MicrosoftAppType === "UserAssignedMsi" ? { ...tokenCredentials } : undefined;

// Create the app with storage
const app = new App({
  ...credentialOptions,
  storage,
});

// Interface for conversation state
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

app.on("message", async (context) => {
  const activity = context.activity;
  const text: string = stripMentionsText(activity);
  const value = activity.value as any;
  const aadObjectId = (activity.from as any).aadObjectId;
  const conversationId = activity.conversation.id;

  if (aadObjectId && conversationId) {
    await saveUserConversation(aadObjectId, conversationId);
  }

  if (value?.action === "acknowledge") {
    const proposal = await acknowledgeProposal(value.proposalId);

    if (!proposal) {
      await context.send("Proposal not found.");
      return;
    }

    const card = createProposalCard(proposal);

    await context.send({
      type: "message",
      attachments: [
        {
          contentType: "application/vnd.microsoft.card.adaptive",
          content: card,
        },
      ],
    });

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

  const card = createLeadProposalCard(proposal);

  await context.send({
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: card,
      },
    ],
  });

  return;
}

if (text === "/reset") {
  storage.delete(activity.conversation.id);
  await context.send("Ok I've deleted the current conversation state.");
  return;
}

if (text === "/count") {
  const state = getConversationState(activity.conversation.id);
  await context.send(`The count is ${state.count}`);
  return;
}

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
    sdkversion: "2.0.0", // Microsoft Teams SDK
  };
  await context.send(JSON.stringify(runtime));
  return;
}

if (text === "my proposals") {

  const proposals = await getProposalsForUser(aadObjectId);

  const cards = proposals.map((proposal) => ({
    contentType: "application/vnd.microsoft.card.adaptive",
    content: createProposalCard(proposal),
  }));

  await context.send({
    type: "message",
    attachments: cards,
  });

  return;
}

if (text === "lead proposals") {

  const proposals = await getProposalsForLead(aadObjectId);

  if (!proposals.length) {
    await context.send("No proposals found for your lead view.");
    return;
  }

  const cards = proposals.map((proposal) => ({
    contentType: "application/vnd.microsoft.card.adaptive",
    content: createLeadProposalCard(proposal),
  }));

  await context.send({
    type: "message",
    attachments: cards,
  });

  return;
}

if (text === "create proposal") {
  const proposal = await createProposal();

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

  return;
}

// Default fallback behavior
await context.send("Try typing: my proposals");
});

export default app;