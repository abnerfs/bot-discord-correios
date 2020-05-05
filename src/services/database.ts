import { Pool, PoolClient } from 'pg';
const {
    DB_HOST,
    DB_DATABASE,
    DB_USER,
    DB_PORT,
    DB_PASSWORD
} = process.env;


if (!DB_HOST || !DB_DATABASE || !DB_USER || !DB_PORT || !DB_PASSWORD)
    throw new Error("Invalid database connection info");

const pool = new Pool({
    host: DB_HOST,
    database: DB_DATABASE,
    user: DB_USER,
    password: DB_PASSWORD,
    port: parseInt(DB_PORT),
    ssl: {
        rejectUnauthorized: false
    }
});


export const getConnection = () : Promise<PoolClient> => pool.connect();

export const createTables = async (cn: PoolClient) => {

    const scripts = [
        `CREATE TABLE IF NOT EXISTS Packages (id SERIAL PRIMARY KEY, code VARCHAR(30) NOT NULL, description VARCHAR(50) NOT NULL, insert_date TIMESTAMP NOT NULL DEFAULT NOW(), UserID VARCHAR(100) ) `,
        `CREATE TABLE IF NOT EXISTS PackageStatus (id SERIAL PRIMARY KEY, PackageID INT REFERENCES Packages(id) NOT NULL, description VARCHAR(200) NOT NULL, date TIMESTAMP NOT NULL )`
    ]
    for(const script of scripts) {
        await cn.query(script);
    }
}





