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
  getActiveProjects,
  getActiveRoles,
  createProject,
  createRole,
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

import {
  handleAcknowledgeProposal,
  handleMyProposals,
} from "./src/handlers/employeeHandlers";
import {
  handleUpdateProposalStatus,
  handleLeadProposals,
  handleBenchPeople,
} from "./src/handlers/leadHandlers";
import { getProposalHistory } from "./src/services/proposalService";
import { createProposalHistoryCard } from "./src/cards/proposalHistoryCard";
import { createSelectProjectCard } from "./src/cards/selectProjectCard";
import { createSelectRoleCard } from "./src/cards/selectRoleCard";
import { createSelectExpectedUpdateCard } from "./src/cards/selectExpectedUpdateCard";

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

  const createProposalSession =
  createProposalSessions.get(conversationId);

  if (createProposalSession) {

    if (createProposalSession.step === "enter-new-project") {
      await createProject(normalizedText);

      createProposalSession.project = normalizedText;
      createProposalSession.step = "select-role";

      createProposalSessions.set(
        conversationId,
        createProposalSession
      );

      const roles = await getActiveRoles();

      await sendAdaptiveCard(
        context,
        createSelectRoleCard(roles)
      );

      return;
    }

    if (createProposalSession.step === "enter-new-role") {
      await createRole(normalizedText);

      createProposalSession.role = normalizedText;
      createProposalSession.step = "select-expected-update";

      createProposalSessions.set(
          conversationId,
          createProposalSession
      );

      await sendAdaptiveCard(
          context,
          createSelectExpectedUpdateCard()
      );

      return;
    }

    // другите flow steps тук
  }

  if (value?.action === "create-proposal-for-person") {
    const projects = await getActiveProjects();

    createProposalSessions.set(conversationId, {
      step: "select-project",
      benchPersonId: value.benchPersonId,
    });

    await sendAdaptiveCard(
        context,
        createSelectProjectCard(projects)
    );

    return;
  }

  if (value?.action === "select-employee") {
    const projects = await getActiveProjects();

    createProposalSessions.set(conversationId, {
      step: "select-project",
      benchPersonId: value.employeeId,
    });

    await sendAdaptiveCard(
        context,
        createSelectProjectCard(projects)
    );

    return;
  }

  if (value?.action === "select-project") {
    const createProposalSession =
        createProposalSessions.get(conversationId);

    if (!createProposalSession) {
      await context.send("No active proposal creation session.");
      return;
    }

    if (value.projectName === "__other__") {
      createProposalSession.step = "enter-new-project";

      createProposalSessions.set(
          conversationId,
          createProposalSession
      );

      await context.send("What is the new project name?");

      return;
    }

    createProposalSession.project = value.projectName;
    createProposalSession.step = "select-role";

    createProposalSessions.set(
        conversationId,
        createProposalSession
    );

    const roles = await getActiveRoles();

    await sendAdaptiveCard(
        context,
        createSelectRoleCard(roles)
    );

    return;
  }

  if (value?.action === "select-role") {
    const createProposalSession =
        createProposalSessions.get(conversationId);

    if (!createProposalSession) {
      await context.send("No active proposal creation session.");
      return;
    }

    if (value.roleName === "__other__") {
      createProposalSession.step = "enter-new-role";

      createProposalSessions.set(
          conversationId,
          createProposalSession
      );

      await context.send("What is the new role name?");

      return;
    }

    createProposalSession.role = value.roleName;
    createProposalSession.step = "select-expected-update";

    createProposalSessions.set(
        conversationId,
        createProposalSession
    );

    await sendAdaptiveCard(
        context,
        createSelectExpectedUpdateCard()
    );

    return;
  }

  if (value?.action === "select-expected-update") {
    const createProposalSession =
        createProposalSessions.get(conversationId);

    if (!createProposalSession) {
      await context.send("No active proposal creation session.");
      return;
    }

    createProposalSession.expectedUpdate = value.expectedUpdate;

    await context.send(
        `Creating proposal for ${createProposalSession.project}...`
    );

    const proposal = await createProposal({
      benchPersonId: createProposalSession.benchPersonId,
      leadAadObjectId: aadObjectId,
      project: createProposalSession.project,
      role: createProposalSession.role,
      expectedUpdate: createProposalSession.expectedUpdate,
      owner: "Ivan Petrov",
    });

    createProposalSessions.delete(conversationId);

    if (!proposal) {
      await context.send("Failed to create proposal.");
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
      await context.send(
          "Employee conversation not found. Notification was not sent."
      );
    }

    return;
  }

  if (value?.action === "acknowledge") {
    await handleAcknowledgeProposal(context, value.proposalId);
    return;
  }

  if (value?.action === "update-status") {
    await handleUpdateProposalStatus(
        context,
        value.proposalId,
        value.status,
        aadObjectId
    );

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
      sdkversion: "2.0.0",
    };

    await context.send(JSON.stringify(runtime));
    return;
  }

  if (value?.action === "view-history") {
    const history = await getProposalHistory(value.proposalId);

    if (!history.length) {
      await context.send("No history found for this proposal.");
      return;
    }

    await sendAdaptiveCard(
        context,
        createProposalHistoryCard(value.proposalId, history)
    );

    return;
  }

  if (normalizedText === Commands.MyProposals) {
    await handleMyProposals(context, aadObjectId);
    return;
  }

  if (normalizedText === Commands.LeadProposals) {
    await handleLeadProposals(context, aadObjectId);
    return;
  }

  if (normalizedText === Commands.CreateProposal) {
    const employees = await getBenchPeople();

    await sendAdaptiveCard(
      context,
      createSelectEmployeeCard(employees)
    );

    return;
  }

  if (normalizedText === Commands.Help) {
    await sendAdaptiveCard(context, createHelpCard());
    return;
  }

  if (normalizedText === Commands.Workflow) {
  await sendAdaptiveCard(context, createWorkflowCard());
  return;
  }

  if (normalizedText === Commands.BenchPeople) {
    const people = await getBenchPeopleForLead(aadObjectId);

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

  /*
if (normalizedText === "profile") {
  const response = await (context.userGraph as any).http.get(
    "/me?$select=id,displayName,mail,userPrincipalName,jobTitle,department,officeLocation"
  );

  await context.send(JSON.stringify(response.data, null, 2));
  return;
}
*/

  await context.send("I didn't recognize that command. Try typing `help`.");
});

export default app;