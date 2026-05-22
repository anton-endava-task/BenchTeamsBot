INSERT INTO bench_people (
  id,
  aad_object_id,
  name,
  discipline,
  bench_status,
  conversation_id,
  bench_since
)
VALUES
  (
    'person-2',
    '00000000-0000-0000-0000-0000000000030',
    'Maria Ivanova',
    'Java',
    'On Bench',
    NULL,
    '2026-05-21 14:55:34.743647'
  ),
  (
    'person-3',
    '00000000-0000-0000-0000-0000000000040',
    'Georgi Petrov',
    'QA',
    'On Bench',
    NULL,
    '2026-05-21 14:55:34.743647'
  ),
  (
    'person-1',
    '00000000-0000-0000-0000-0000000000020',
    'Alex Wilber',
    'Java',
    'On Bench',
    NULL,
    '2026-04-30 14:55:41.896963'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO proposal_statuses (
  id,
  name,
  display_order,
  is_terminal
)
VALUES
  ('proposed', 'Proposed', 1, false),
  ('interview_requested', 'Interview Requested', 2, false),
  ('client_reviewing', 'Client Reviewing', 3, false),
  ('confirmed', 'Confirmed', 4, true),
  ('rejected', 'Rejected', 5, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (
    id,
    name,
    client,
    status
)
VALUES
    ('project-orion', 'Orion', 'Demo Client', 'Active'),
    ('project-phoenix', 'Phoenix', 'Demo Client', 'Active'),
    ('project-atlas', 'Atlas', 'Demo Client', 'Active')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO roles (
    id,
    name,
    discipline,
    status
)
VALUES
    ('role-senior-java-developer', 'Senior Java Developer', 'Java', 'Active'),
    ('role-qa-engineer', 'QA', 'QA', 'Active'),
    ('role-tech-lead', 'Tech Lead', 'Java', 'Active'),
    ('role-senior-backend-developer', 'Senior Backend Developer', 'Java', 'Active')
    ON CONFLICT (id) DO NOTHING;
