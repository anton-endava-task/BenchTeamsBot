import { pool } from "../db/db";
import { Proposal } from "../models/proposal";

export async function getProposalsForUser(
  userId: string
): Promise<Proposal[]> {
  const result = await pool.query(
  `
    SELECT
      p.id,
      bp.name as employee_name,
      bp.discipline,
      bp.bench_status,
      p.project,
      p.role,
      p.status,
      p.expected_update as "expectedUpdate",
      p.owner,
      p.acknowledged,
      p.updated_at as "updatedAt"
    FROM proposals p
    JOIN bench_people bp
      ON bp.id = p.bench_person_id
    WHERE bp.aad_object_id = $1
  `,
  [userId]
);

  return result.rows;
}

export async function acknowledgeProposal(
  proposalId: string
): Promise<Proposal | undefined> {
  const result = await pool.query(
    `
    UPDATE proposals
    SET acknowledged = true
    WHERE id = $1
    RETURNING
      id,
      project,
      role,
      status,
      expected_update as "expectedUpdate",
      owner,
      acknowledged
    `,
    [proposalId]
  );

  return result.rows[0];
}

export async function getProposalsForLead(
  leadAadObjectId: string
): Promise<Proposal[]> {
  const result = await pool.query(
  `
    SELECT
      p.id,
      bp.name as employee_name,
      bp.discipline,
      bp.bench_status,
      p.project,
      p.role,
      p.status,
      p.expected_update as "expectedUpdate",
      p.owner,
      p.acknowledged,
      p.updated_at as "updatedAt"
    FROM proposals p
    JOIN bench_people bp
      ON bp.id = p.bench_person_id
    WHERE p.lead_aad_object_id = $1
    ORDER BY bp.name, p.project
  `,
  [leadAadObjectId]
);

  return result.rows;
}

export async function updateProposalStatus(
  proposalId: string,
  status: string,
  changedBy: string
): Promise<Proposal | undefined> {
  
  const existing = await pool.query(
    `
      SELECT status
      FROM proposals
      WHERE id = $1
    `,
    [proposalId]
  );

  const oldStatus = existing.rows[0]?.status;

  const result = await pool.query(
    `
      UPDATE proposals
      SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING
        id,
        employee_name,
        discipline,
        project,
        role,
        status,
        expected_update as "expectedUpdate",
        owner,
        acknowledged,
        updated_at as "updatedAt"
    `,
    [status, proposalId]
  );



  await pool.query(
      `
        INSERT INTO proposal_history (
          proposal_id,
          event_type,
          old_status,
          new_status,
          changed_by
        )
        VALUES ($1, $2, $3, $4, $5)
      `,
      [
        proposalId,
        "StatusChanged",
        oldStatus,
        status,
        changedBy,
      ]
  );

  return result.rows[0];
}

export async function createProposal(input: {
  benchPersonId: string;
  leadAadObjectId: string;
  project: string;
  role: string;
  expectedUpdate: string;
  owner: string;
}): Promise<Proposal | undefined> {
  const result = await pool.query(
    `
      INSERT INTO proposals (
        id,
        bench_person_id,
        aad_object_id,
        lead_aad_object_id,
        project,
        role,
        status,
        expected_update,
        owner,
        acknowledged,
        updated_at
      )
      VALUES (
        gen_random_uuid()::text,
        $1,
        NULL,
        $2,
        $3,
        $4,
        'Proposed',
        $5,
        $6,
        false,
        NOW()
      )
      RETURNING id
    `,
    [
      input.benchPersonId,
      input.leadAadObjectId,
      input.project,
      input.role,
      input.expectedUpdate,
      input.owner,
    ]
  );

  const proposalId = result.rows[0].id;

  await pool.query(
      `
    INSERT INTO proposal_history (
      proposal_id,
      event_type,
      old_status,
      new_status,
      changed_by
    )
    VALUES ($1, $2, $3, $4, $5)
  `,
      [
        proposalId,
        "ProposalCreated",
        null,
        "Proposed",
        input.leadAadObjectId,
      ]
  );

  const fullProposal = await pool.query(
    `
      SELECT
        p.id,
        bp.name as employee_name,
        bp.discipline,
        bp.bench_status,
        p.project,
        p.role,
        p.status,
        p.expected_update as "expectedUpdate",
        p.owner,
        p.acknowledged,
        p.updated_at as "updatedAt"
      FROM proposals p
      JOIN bench_people bp
        ON bp.id = p.bench_person_id
      WHERE p.id = $1
    `,
    [proposalId]
  );

  return fullProposal.rows[0];
}

export async function saveUserConversation(
  aadObjectId: string,
  conversationId: string
): Promise<void> {
  await pool.query(
    `
      UPDATE bench_people
      SET conversation_id = $1
      WHERE aad_object_id = $2
    `,
    [conversationId, aadObjectId]
  );
}

export async function getConversationIdForProposal(
  proposalId: string
): Promise<string | undefined> {
  const result = await pool.query(
    `
      SELECT bp.conversation_id
      FROM proposals p
      JOIN bench_people bp
        ON bp.id = p.bench_person_id
      WHERE p.id = $1
    `,
    [proposalId]
  );

  return result.rows[0]?.conversation_id;
}

export async function getBenchPeople(): Promise<any[]> {
  const result = await pool.query(`
    SELECT
      id,
      name,
      discipline,
      bench_status
    FROM bench_people
    WHERE bench_status = 'On Bench'
    ORDER BY name
  `);

  return result.rows;
}

export async function getBenchPeopleForLead(
  leadAadObjectId: string
): Promise<any[]> {
  const result = await pool.query(
    `
      SELECT
        bp.id,
        bp.name,
        bp.discipline,
        bp.bench_status,
        bp.bench_since,
        COUNT(p.id) FILTER (
          WHERE p.status NOT IN ('Confirmed', 'Rejected')
        ) AS active_proposals,
        COUNT(p.id) FILTER (
          WHERE p.updated_at < NOW() - INTERVAL '7 days'
            AND p.status NOT IN ('Confirmed', 'Rejected')
        ) AS stale_proposals,
        MAX(p.updated_at) AS last_proposal_update
      FROM bench_people bp
      LEFT JOIN proposals p
        ON p.bench_person_id = bp.id
       AND p.lead_aad_object_id = $1
      WHERE bp.bench_status = 'On Bench'
      GROUP BY bp.id, bp.name, bp.discipline, bp.bench_status, bp.bench_since
      ORDER BY bp.name
    `,
    [leadAadObjectId]
  );

  return result.rows;
}

export async function getProposalHistory(
    proposalId: string
): Promise<any[]> {
  const result = await pool.query(
      `
        SELECT
          ph.event_type,
          ph.old_status,
          ph.new_status,
          ph.changed_by,
          ph.changed_at,
          bp.name as changed_by_name
        FROM proposal_history ph
               LEFT JOIN bench_people bp
                         ON bp.aad_object_id = ph.changed_by
        WHERE ph.proposal_id = $1
        ORDER BY ph.changed_at ASC
      `,
      [proposalId]
  );

  return result.rows;
}

export async function getActiveProjects(): Promise<any[]> {
    const result = await pool.query(
        `
      SELECT
        id,
        name,
        client,
        status
      FROM projects
      WHERE status = 'Active'
      ORDER BY name
    `
    );

    return result.rows;
}

export async function getActiveRoles(): Promise<any[]> {
    const result = await pool.query(
        `
      SELECT
        id,
        name,
        discipline,
        status
      FROM roles
      WHERE status = 'Active'
      ORDER BY name
    `
    );

    return result.rows;
}