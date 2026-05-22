CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS bench_people (
  id TEXT PRIMARY KEY,
  aad_object_id TEXT NOT NULL,
  name TEXT NOT NULL,
  discipline TEXT NOT NULL,
  bench_status TEXT NOT NULL DEFAULT 'On Bench',
  conversation_id TEXT,
  bench_since TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proposal_statuses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INT NOT NULL,
  is_terminal BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS proposals (
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

CREATE TABLE IF NOT EXISTS proposal_history (
    id SERIAL PRIMARY KEY,
    proposal_id TEXT NOT NULL REFERENCES proposals(id),
    event_type TEXT NOT NULL DEFAULT 'StatusChanged',
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by TEXT,
    changed_at TIMESTAMP DEFAULT NOW()
);
