import { PackageInfoStatus, PackageInfo } from "./models";
import { getPackageCorreios } from "./services/CorreioService";
import { getPackageInfo, getConnection, savePackageInfo } from "./services/database";


const statusChanged = async (lastStatus: PackageInfoStatus, code: string) => {
    console.log(`Novo status ${code}: ${lastStatus.description} `);
}

const checkStatusChanged = (infoSaved: PackageInfo | undefined, info: PackageInfo) : Boolean => {
    const firstStatusSaved = infoSaved?.status[0];
    const firstStatus = info.status[0];

    return !firstStatusSaved 
        || !firstStatusSaved.description 
        || firstStatusSaved.description != firstStatus.description;
}

export const checkPackages = async (codes: string[]) => {
    for(const code of codes) {

        const cn = await getConnection();
        try{
            const infoSaved = await getPackageInfo(code, cn);
            const info = await getPackageCorreios(code);    
        
            if(checkStatusChanged(infoSaved, info)) {
                statusChanged(info.status[0], code);
                await savePackageInfo(info, cn);
            }
        
        }
        finally {
            cn.release();
        }
    }
};

const INTERVAL_MS = 1000 * 60 * 5;

export const app =  async(codes: string[]) => {
    checkPackages(codes);
    setInterval(() =>  { 
        checkPackages(codes)
        
    }, INTERVAL_MS);
}

