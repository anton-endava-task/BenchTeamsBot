# Bench Teams Bot

## Overview

Bench Teams Bot is a Microsoft Teams application designed to help discipline leads communicate with employees on bench regarding:

* project proposals
* staffing pipeline status
* workflow transitions
* acknowledgements
* stale proposals
* proposal history

The application is built as a workflow-first Teams business application using:

* Microsoft Teams Bot
* Adaptive Cards
* TypeScript
* PostgreSQL
* Docker
* WSL2

---

# Current Features

## Employee Workflow

Employees can:

* view their proposals
* acknowledge proposals
* track proposal statuses
* see workflow updates

Command:

```text
my proposals
```

---

## Lead Workflow

Discipline leads can:

* view all proposals for their people
* update proposal statuses
* detect stale proposals
* track acknowledgements
* create new proposals

Command:

```text
lead proposals
```

---

## Workflow Statuses

Current proposal statuses:

* Proposed
* Interview Requested
* Client Reviewing
* Confirmed
* Rejected

---

# Architecture

## High-Level Architecture

```text
Microsoft Teams
        ↓
Teams Bot
        ↓
Command Handlers
        ↓
Services
        ↓
PostgreSQL
```

---

## Project Structure

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
│   │   ├── proposalCard.ts
│   │   └── leadProposalCard.ts
│   │
│   ├── db/
│   │   └── db.ts
│   │
│   ├── models/
│   │   └── proposal.ts
│   │
│   └── services/
│       └── proposalService.ts
│
├── app.ts
├── package.json
└── README.md
```

---

# Database Schema

## bench_people

Stores people currently on bench.

```sql
CREATE TABLE IF NOT EXISTS bench_people (
  id TEXT PRIMARY KEY,
  aad_object_id TEXT NOT NULL,
  name TEXT NOT NULL,
  discipline TEXT NOT NULL,
  bench_status TEXT NOT NULL DEFAULT 'On Bench',
  conversation_id TEXT
);
```

---

## proposals

Stores staffing proposals.

```sql
CREATE TABLE IF NOT EXISTS proposals (
  id TEXT PRIMARY KEY,
  bench_person_id TEXT REFERENCES bench_people(id),
  aad_object_id TEXT,
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

Stores workflow audit history.

```sql
CREATE TABLE IF NOT EXISTS proposal_history (
  id SERIAL PRIMARY KEY,
  proposal_id TEXT NOT NULL REFERENCES proposals(id),
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by TEXT,
  changed_at TIMESTAMP DEFAULT NOW()
);
```

---

# Local Development Onboarding

## Prerequisites

Install:

* WSL2
* Ubuntu 22.04
* VS Code
* Docker Desktop
* Node.js
* Git

Recommended setup:

```text
VS Code + WSL2 Ubuntu
```

---

# VS Code Extensions

Install:

* WSL (Microsoft)
* Microsoft 365 Agents Toolkit

---

# Clone Repository

```bash
git clone <repository-url>
cd BenchTeamsBot
```

---

# Open Project in WSL

```bash
code .
```

Verify bottom-left corner in VS Code:

```text
WSL: Ubuntu
```

---

# Install Dependencies

```bash
npm install
```

---

# Start PostgreSQL

## Start database container

```bash
./docker/postgres/run.sh
```

This will:

* start PostgreSQL
* create schema
* seed sample data

---

# Database Connection

Current local connection:

```text
Host: localhost
Port: 5432
Database: benchbot
Username: benchbot
Password: benchbot
```

---

# Start Teams Bot

In VS Code:

```text
F5
```

This will:

* start local bot server
* create Teams tunnel
* open Microsoft 365 Agents Playground

---

# Test Commands

## Employee View

```text
my proposals
```

---

## Lead View

```text
lead proposals
```

---

## Create Proposal

```text
create proposal
```

---

# Workflow Features

## Acknowledge Proposal

Employees can acknowledge proposals directly from Adaptive Cards.

Acknowledgements are persisted in PostgreSQL.

---

## Status Transitions

Lead cards support workflow transitions.

Examples:

* Interview Requested → Client Reviewing
* Client Reviewing → Confirmed
* Any active state → Rejected

---

## Stale Proposal Detection

Lead cards display:

* stale age
* warning indicators
* freshness tracking

---

## Audit History

All status transitions are stored in:

```text
proposal_history
```

Including:

* old status
* new status
* changed by
* timestamp

---

# Current Technical Decisions

## Why Teams Bot?

* users already work in Teams
* native communication workflow
* proactive notifications
* Adaptive Cards support
* enterprise identity integration

---

## Why PostgreSQL?

* fast local setup
* excellent Docker support
* easy Azure migration
* strong relational modeling

---

## Why WSL2?

* stable Node.js tooling
* Linux-first developer experience
* better Docker compatibility
* cleaner terminal environment

---

# Future Roadmap

## Planned Features

### Proactive Notifications

* proposal created
* status changed
* stale proposal reminders

---

### Dynamic Proposal Creation

* employee selection
* project selection
* role selection
* lead assignment

---

### Bench Dashboard

* people without proposals
* stale proposal counts
* rejected proposal analytics
* active staffing pipeline

---

### Azure Deployment

* Azure App Service
* Azure Database
* production Teams app
* tenant deployment

---

### AI Features (Later)

Potential future AI capabilities:

* staffing summaries
* proposal insights
* smart matching
* semantic search

AI features are intentionally deferred until workflow stability is achieved.

---

# Engineering Principles

The project intentionally follows:

```text
workflow-first architecture
```

instead of:

```text
AI-first architecture
```

Core philosophy:

```text
Reliable workflow automation first.
AI augmentation later.
```

---

# Troubleshooting

## Node Not Found in WSL

Install Node.js inside WSL:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## Verify WSL Context

Bottom-left VS Code should show:

```text
WSL: Ubuntu
```

---

## PostgreSQL Container Running

```bash
docker ps
```

---

## View Database Tables

```bash
docker exec -it bench-bot-postgres psql -U benchbot -d benchbot
```

---

# Current MVP Status

The application currently supports:

* multi-user proposal workflows
* lead and employee experiences
* persistent database storage
* audit history
* stale detection
* Teams-native Adaptive Cards
* workflow state transitions
* conversation tracking foundations for proactive messaging

The project is currently at:

```text
working enterprise MVP foundation
```

