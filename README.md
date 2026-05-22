# Bench Teams Bot

## Overview

Bench Teams Bot is a Microsoft Teams workflow application designed to improve communication between discipline leads and employees on bench.

The application provides:

- bench dashboard visibility
- guided proposal creation workflows
- proposal lifecycle tracking
- staffing workflow management
- proposal acknowledgements
- workflow state transitions
- proactive Teams notifications
- stale proposal detection
- proposal timelines and audit history

---

# Tech Stack

- Microsoft Teams Bot
- Microsoft 365 Agents Toolkit
- TypeScript
- PostgreSQL
- Docker
- WSL2
- Adaptive Cards

---

# Key Features

## Bench Dashboard

Lead users can open a bench dashboard showing:

- available bench employees
- active proposal counts
- stale proposal indicators
- last proposal updates
- quick proposal creation actions

Command:

```text
bench people
```

---

## Guided Proposal Creation

Proposal creation uses a guided conversational workflow with Adaptive Cards:

1. Select employee
2. Select project
3. Select role
4. Select expected update date
5. Create proposal
6. Send proactive Teams notification

---

## Employee Workflow

Employees can:

- view active proposals
- acknowledge proposals
- track proposal statuses
- receive proactive Teams notifications

Command:

```text
my proposals
```

---

## Lead Workflow

Leads can:

- manage staffing workflows
- update proposal statuses
- monitor stale proposals
- review proposal timelines
- create proposals directly from the bench dashboard

Command:

```text
lead proposals
```

---

## Workflow Timeline

Each proposal includes:

- audit history
- workflow transitions
- timestamps
- actor tracking
- proposal lifecycle timeline

---

# Workflow Statuses

Current proposal statuses:

- Proposed
- Interview Requested
- Client Reviewing
- Confirmed
- Rejected

---

# Tech Architecture

```text
Microsoft Teams
        ↓
Teams Bot
        ↓
Handlers / Workflow Orchestration
        ↓
Services
        ↓
PostgreSQL
```

---

# Local Development Setup

## Prerequisites

Install:

- WSL2
- Ubuntu 22.04
- VS Code
- Docker Desktop
- Node.js
- Git

Recommended setup:

```text
IntelliJ + WSL2
VS Code for Teams Toolkit debugging
```

---

# Install Dependencies

```bash
npm install
```

---

# Start PostgreSQL

```bash
./docker/postgres/run.sh
```

This will:

- start PostgreSQL
- initialize database schema
- seed sample reference data

---

# Start Teams Bot

Open the project in VS Code and press:

```text
F5
```

This will:

- start local bot server
- create Teams tunnel
- open Microsoft 365 Agents Playground

---

# Available Commands

## Employee

```text
my proposals
```

---

## Lead

```text
bench people
lead proposals
create proposal
```

---

## Information

```text
help
workflow
```

---

# Reference Data

The application currently uses reference data tables for:

- proposal statuses
- projects
- roles

This enables:

- dropdown-based workflows
- guided proposal creation
- consistent domain data
- easier future administration

---

# Documentation

Detailed architecture and onboarding documentation:

```text
docs/architecture-and-onboarding.md
```

---

# Current MVP Status

The project currently represents:

```text
working enterprise staffing workflow platform MVP
```