import { PackageInfoStatus, PackageInfo } from "./models";
import { getPackageInfo, savePackageInfo } from "./services/storage";
import { getPackageCorreios } from "./services/CorreioService";


const statusChanged = async (lastStatus: PackageInfoStatus, code: string) => {
    console.log(`Novo status ${code}: ${lastStatus.desc} `);
}

const checkStatusChanged = (infoSaved: PackageInfo | undefined, info: PackageInfo) : Boolean => {
    const firstStatusSaved = infoSaved?.status[0];
    const firstStatus = info.status[0];

    return !firstStatusSaved 
        || !firstStatusSaved.desc 
        || firstStatusSaved.desc != firstStatus.desc;
}

export const app = async (code: string) => {

    const infoSaved = getPackageInfo(code);
    const info = await getPackageCorreios(code);    

    if(checkStatusChanged(infoSaved, info))
        statusChanged(info.status[0], code);

    savePackageInfo(info);
};