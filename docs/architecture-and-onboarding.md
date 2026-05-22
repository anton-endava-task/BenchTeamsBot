# Bench Teams Bot

## Overview

Bench Teams Bot is a Microsoft Teams workflow application designed to improve communication between discipline leads and employees on bench.

The application provides:

- proposal lifecycle tracking
- staffing workflow management
- proposal acknowledgements
- workflow state transitions
- stale proposal detection
- proposal timelines and audit history
- proactive Teams notifications
- guided conversational workflows

The project is built as a workflow-first enterprise Teams application.

---

# Current Features

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

Discipline leads can:

- view all proposals for their people
- manage staffing workflow transitions
- track stale proposals
- monitor acknowledgements
- create new proposals
- access bench dashboard
- review proposal timelines

Commands:

```text
lead proposals
bench people
create proposal
```

---

# Guided Proposal Creation

Proposal creation is implemented as a guided conversational workflow.

Flow:

```text
Bench Dashboard
↓
Select Employee
↓
Select Project
↓
Select Role
↓
Select Expected Update Date
↓
Proposal Creation
↓
Employee Notification
```

The workflow uses:

- Adaptive Card buttons
- dropdown selectors
- date pickers
- conversational state management

---

# Workflow Statuses

Current proposal statuses:

- Proposed
- Interview Requested
- Client Reviewing
- Confirmed
- Rejected

---

# Architecture

## High-Level Architecture

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

# Project Structure

```text
BenchTeamsBot/
├── docker/
│   └── postgres/
│       ├── run.sh
│       └── init/
│           ├── 001-schema.sql
│           └── 002-seed.sql
│
├── src/
│   ├── cards/
│   ├── constants/
│   ├── db/
│   ├── handlers/
│   ├── models/
│   ├── services/
│   └── utils/
│
├── app.ts
├── README.md
└── docs/
```

---

# Database Schema

## bench_people

Stores employees currently on bench.

```sql
CREATE TABLE bench_people (
  id TEXT PRIMARY KEY,
  aad_object_id TEXT NOT NULL,
  name TEXT NOT NULL,
  discipline TEXT NOT NULL,
  bench_status TEXT NOT NULL DEFAULT 'On Bench',
  conversation_id TEXT,
  bench_since TIMESTAMP DEFAULT NOW()
);
```

---

## projects

Reference data for available projects.

```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  client TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## roles

Reference data for available staffing roles.

```sql
CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  discipline TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## proposal_statuses

Reference data for workflow statuses.

```sql
CREATE TABLE proposal_statuses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INT NOT NULL,
  is_terminal BOOLEAN NOT NULL DEFAULT FALSE
);
```

---

## proposals

Stores staffing proposals.

```sql
CREATE TABLE proposals (
  id TEXT PRIMARY KEY,
  bench_person_id TEXT NOT NULL REFERENCES bench_people(id),
  lead_aad_object_id TEXT,
  project TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL,
  expected_update TEXT NOT NULL,
  owner TEXT NOT NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## proposal_history

Stores proposal audit history and workflow timeline.

```sql
CREATE TABLE proposal_history (
  id SERIAL PRIMARY KEY,
  proposal_id TEXT NOT NULL REFERENCES proposals(id),
  event_type TEXT NOT NULL DEFAULT 'StatusChanged',
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by TEXT,
  changed_at TIMESTAMP DEFAULT NOW()
);
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

# Bench Dashboard

The bench dashboard provides:

- available employees
- active proposal counts
- stale proposal indicators
- last proposal updates
- quick proposal creation actions

Command:

```text
bench people
```

---

# Proposal Timeline

Each proposal includes:

- workflow audit history
- status transitions
- timestamps
- actor tracking
- timeline visualization

Accessible via:

```text
View History
```

button on lead proposal cards.

---

# Proactive Notifications

The application supports proactive Teams notifications.

When a proposal is created:

```text
Lead creates proposal
↓
Proposal stored in PostgreSQL
↓
Employee conversation resolved
↓
Adaptive Card notification sent proactively
```

---

# Reference Data

The application currently uses reference data tables for:

- projects
- roles
- proposal statuses

This enables:

- dropdown-based workflows
- guided proposal creation
- consistent domain data
- easier future administration

---

# Current Engineering Direction

Current architecture priorities:

- workflow-first design
- strong domain modeling
- guided UX
- operational visibility
- auditability
- proactive communication

AI-specific functionality is intentionally deferred until workflow maturity is achieved.

---

# Future Roadmap

Planned future features:

- proposal comments
- reminder jobs
- status change notifications
- Azure deployment
- Microsoft Graph integration
- admin/reference-data management UI
- analytics dashboards
- staffing insights
- AI-assisted staffing recommendations

---

# Current MVP Status

The project currently represents:

```text
working enterprise staffing workflow platform MVP
```
