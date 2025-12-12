import { Pool } from 'pg';
import { env } from './env';

export const pgPool = new Pool({ connectionString: env.postgresUrl });

export async function ensureSchema() {
  await pgPool.query(`
    create table if not exists interactions (
      id serial primary key,
      created_at timestamptz not null default now(),
      session_id text not null,
      user_query text not null,
      llm_response text not null,
      response_time_ms integer not null,
      source_documents jsonb
    );
  `);
}
