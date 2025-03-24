import pool from './database.js';

async function queryDatabase(query, params = []) {
    try {
        const [rows] = await pool.execute(query, params);
        return rows;
    } catch (error) {
        console.error('Error ejecutando la consulta:', error);
        throw error;
    }
}

export { queryDatabase };