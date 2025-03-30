import dotenv from "dotenv";
import { join } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

dotenv.config({ path: join(fileURLToPath(import.meta.url), "../../../.env") });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;