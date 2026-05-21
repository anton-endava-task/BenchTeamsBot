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
        old_status,
        new_status,
        changed_by
      )
      VALUES ($1, $2, $3, $4)
    `,
    [proposalId, oldStatus, status, changedBy]
  );

  return result.rows[0];
}

export async function createProposal(): Promise<Proposal | undefined> {
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
        'person-1',
        '00000000-0000-0000-0000-0000000000020',
        '00000000-0000-0000-0000-0000000000020',
        'Orion',
        'Senior Backend Developer',
        'Proposed',
        'Next Week',
        'Ivan Petrov',
        false,
        NOW()
      )
      RETURNING
        id,
        project,
        role,
        status,
        expected_update as "expectedUpdate",
        owner,
        acknowledged,
        updated_at as "updatedAt"
    `
  );

  const proposalId = result.rows[0].id;

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