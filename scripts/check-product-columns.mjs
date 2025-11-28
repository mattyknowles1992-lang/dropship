import 'dotenv/config';
import { Client } from 'pg';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const result = await client.query(
      `SELECT column_name, data_type
         FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'Product'
        ORDER BY column_name;`
    );
    console.table(result.rows);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
