import postgres from "postgres";
import dotenv from "dotenv";


dotenv.config();

const sql = postgres({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5433,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10,
  idle_timeout: 30,
});

export default sql;



