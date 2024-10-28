import sql from "mysql";
import dotenv from "dotenv"

dotenv.config()

// Create a MySQL connection pool and name it 'connection'
let connection = sql.createPool({
    connectionLimit: 10, // Adjust based on your app's concurrency needs
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

// Function to get a connection from the pool
connection.getConnection((err, conn) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
        return;
    }
    if (conn) {
        conn.release();
        console.log("Connected to the database successfully!");
    } // Release the connection back to the pool
});


export default connection;

