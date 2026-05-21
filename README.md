# Bench Teams Bot

## Overview

Bench Teams Bot is a Microsoft Teams workflow application designed to improve communication between discipline leads and employees on bench.

The application provides:

- proposal lifecycle tracking
- staffing workflow management
- proposal acknowledgements
- workflow state transitions
- stale proposal detection
- audit history

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

# Quick Start

## Install dependencies

```bash
npm install
```

---

## Start PostgreSQL

```bash
./docker/postgres/run.sh
```

This will:

- start PostgreSQL
- create database schema
- seed sample data

---

## Start Teams Bot

Press:

```text
F5
```

in VS Code.

This will:

- start local bot server
- create Teams tunnel
- open Microsoft 365 Agents Playground

---

# Commands

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

# Documentation

Detailed architecture and onboarding documentation:

```text
docs/architecture-and-onboarding.md
```

---

# Current MVP Status

```text
working enterprise staffing workflow MVP
```