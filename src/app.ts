import { PackageInfoStatus, PackageInfo } from "./models";
import { getPackageCorreios } from "./services/CorreioService";
import { getPackageInfo, getConnection, savePackageInfo, listCodes, createTables } from "./services/database";
import { PoolClient } from "pg";
import { sendStatusUpdate } from "./services/bot";


const statusChanged = async (lastStatus: PackageInfoStatus, channelID: string, userID: string, code: string) => {
    sendStatusUpdate(channelID, userID, lastStatus);
    console.log(`Novo status ${code}: ${lastStatus.description}`);
}

const checkStatusChanged = (infoSaved: PackageInfo | undefined, info: PackageInfo): Boolean => {
    const firstStatusSaved = infoSaved?.status[0];
    const firstStatus = info.status[0];

    return !firstStatusSaved
        || !firstStatusSaved.description
        || firstStatusSaved.description != firstStatus.description;
}

export const checkPackageWithoutCN = async (code: string, channelID: string, userID: string) => {
    const cn = await getConnection();
    try {
        const packageInfo = await getPackageInfo(code, cn);
        if(packageInfo)
            return packageInfo;

        const result = await checkPackage(code, channelID, userID, cn);
        return result;
    }
    finally {
        cn.release();
    }
}

const checkPackage = async (code: string, channelID: string, userID: string, cn: PoolClient) => {
    const infoSaved = await getPackageInfo(code, cn);
    const info = await getPackageCorreios(code);
    info.channelID = infoSaved?.channelID || channelID;
    info.userID = infoSaved?.userID || userID;

    if (checkStatusChanged(infoSaved, info)) {
        statusChanged(info.status[0], info.channelID, info.userID,  code);
        await savePackageInfo(info, cn);
    }
    return info;
}


const checkPackages = async () => {
    const cn = await getConnection();
    try {
        const codes = await listCodes(cn);
        console.log('Codigos encontrados: ' + codes.length);

        for (const code of codes) {
            await checkPackage(code, '', '', cn);
        }

    }
    finally {
        cn.release();
    }
};

const INTERVAL_MS = 1000 * 60 * 5;

export const app = async () => {

    await createTables();

    checkPackages();
    setInterval(() => {
        checkPackages()

    }, INTERVAL_MS);
}

