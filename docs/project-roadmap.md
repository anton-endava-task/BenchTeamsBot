# Bench Teams Bot - Project Roadmap

## Project Goal

Create a Microsoft Teams application that helps discipline leads manage employees on bench, track staffing opportunities and maintain visibility throughout the staffing lifecycle.

The application should provide:

* visibility of available bench employees
* proposal lifecycle management
* employee notifications
* workflow tracking
* auditability
* future integration with Microsoft Graph and organizational hierarchy

---

# Target Vision

```text
Microsoft Teams
        ↓
Bench Dashboard
        ↓
Proposal Management
        ↓
Employee Communication
        ↓
Workflow Tracking
        ↓
Staffing Analytics
```

The application should become a lightweight staffing workflow platform integrated into Microsoft Teams.

---

# Current Architecture

```text
Microsoft Teams
        ↓
Bot
        ↓
Handlers
        ↓
Services
        ↓
PostgreSQL
```

Project structure:

```text
cards/
constants/
db/
handlers/
models/
services/
utils/
```

---

# Implemented Features

## Bench Dashboard

Command:

```text
bench people
```

Provides:

* available bench employees
* active proposal count
* stale proposal indicators
* days on bench
* quick actions

Status: ✅ Complete

---

## Proposal Lifecycle

Statuses:

```text
Proposed
Interview Requested
Client Reviewing
Confirmed
Rejected
```

Status: ✅ Complete

---

## Guided Proposal Creation

Workflow:

```text
Select Employee
↓
Select Project
↓
Select Role
↓
Select Expected Update Date
↓
Create Proposal
```

Features:

* project dropdown
* role dropdown
* date picker
* inline creation of missing projects
* inline creation of missing roles

Status: ✅ Complete

---

## Employee Workflow

Features:

* proposal notifications
* proposal acknowledgement
* proposal visibility

Status: ✅ Complete

---

## Proactive Notifications

Workflow:

```text
Lead creates proposal
↓
Proposal stored
↓
Employee notified
```

Status: ✅ Complete (local runtime)

---

## Proposal Timeline

Features:

* audit history
* workflow transitions
* timestamps
* actor tracking

Status: ✅ Complete

---

# Reference Data

Implemented:

## Projects

* dropdown selection
* dynamic creation

Status: ✅ Complete

---

## Roles

* dropdown selection
* dynamic creation

Status: ✅ Complete

---

## Proposal Statuses

Status: ✅ Complete

---

# Current Limitations

## User Data

Currently using local application data.

Goal:

```text
Microsoft Graph
```

Status: ⏳ Planned

---

## Teams Deployment

Current:

```text
Playground
+
Local Teams package
```

Goal:

```text
Real Teams Application
```

Status: ⏳ In Progress

---

## Permissions

Current:

```text
No role-based authorization
```

Goal:

```text
Lead
Employee
Admin
```

Status: ⏳ Planned

---

# Next Steps

## Phase 1 - Real Teams Integration

* real bot registration
* real Teams deployment
* Microsoft Graph access
* user profile retrieval

Status: 🔄 In Progress

---

## Phase 2 - Organizational Integration

* user directory integration
* manager hierarchy
* reporting structure
* Teams deep links

Status: ⏳ Planned

---

## Phase 3 - Proposal Comments

* comments
* notes
* rejection reasons
* workflow context

Status: ⏳ Planned

---

## Phase 4 - Notifications

* reminder jobs
* stale proposal reminders
* status change notifications

Status: ⏳ Planned

---

## Phase 5 - Administration

* project management
* role management
* permissions management

Status: ⏳ Planned

---

## Phase 6 - Analytics

* staffing metrics
* bench utilization
* proposal conversion rates
* operational dashboards

Status: ⏳ Planned

---

# Long-Term Vision

Transform Bench Teams Bot from a workflow prototype into a Teams-native staffing management platform integrated with Microsoft Graph and organizational data.
