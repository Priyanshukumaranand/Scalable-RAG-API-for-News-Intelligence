import { Pool } from 'pg';
import { env } from './env';

let pgPool: Pool;
let ensureSchema: () => Promise<void>;

if (process.env.NODE_ENV === 'test') {
  const mock = {
    async query() {
      return { rows: [] };
    },
  } as unknown as Pool;

  pgPool = mock;
  ensureSchema = async () => Promise.resolve();
} else {
  pgPool = new Pool({ connectionString: env.postgresUrl });
  ensureSchema = async () => {
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
  };
}

export { pgPool, ensureSchema };
