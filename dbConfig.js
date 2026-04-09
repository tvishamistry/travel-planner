import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({
    user: "postgres",
    password: "MvishaTistry07",
    database: "travel-planner-database",
    host: "localhost",
    port: 5432
});

pool.connect()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database not connected', err));

export default pool;