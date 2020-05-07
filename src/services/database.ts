import { Pool, PoolClient } from 'pg';
import { PackageInfo, PackageInfoStatus } from '../models';
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


export const getPackageInfo = async (code: string, cn: PoolClient) : Promise<PackageInfo | undefined> => {
    const packageResult = await cn.query(`SELECT * FROM Packages WHERE code = $1`, [code]);
    if(!packageResult.rows.length)
        return undefined;

    const id = packageResult.rows[0].id as number;
    const packageDescription = packageResult.rows[0].description as string || '';

    const packageStatusResult = await cn.query(`SELECT * FROM PackageStatus WHERE PackageID = $1`, [id]);

    const status = packageStatusResult.rows.map(statusResult => {
        const { date, description, id } = statusResult;

        let s : PackageInfoStatus = {
            date,
            description,
            id
        }
        return s;
    })

    return {
        code,
        id,
        status,
        description: packageDescription
    }
}

export const savePackageInfo = async (info: PackageInfo, cn: PoolClient) => {
    if(!info.id) {
        await cn.query(`INSERT INTO Packages (code, description) VALUES($1, $2)`, [info.code, info.description]);

        const packageResult = await cn.query(`SELECT id FROM packages WHERE code = $1`, [info.code]);
        info.id = packageResult.rows[0].id;
    }

    await cn.query('DELETE FROM PackageStatus WHERE id = $1', [info.id]);
    
    for(const status of info.status) {
        await cn.query('INSERT INTO PackageStatus(PackageID, description, date) VALUES($1, $2, $3) ', [info.id, status.description, status.date]);
    }
}







