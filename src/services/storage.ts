import { PackageInfo } from "../models";
import fs from 'fs';

const dataFolder = __dirname + '../../../data';

const getFileName = (code: string) => `${dataFolder}/${code}.json`;

const ensureDataFolderExists = () => {
    if(!fs.existsSync(dataFolder))
        fs.mkdirSync(dataFolder)

}
ensureDataFolderExists();

export const savePackageInfo = (info: PackageInfo) => {
    const fileName = getFileName(info.code);
    fs.writeFileSync(fileName, JSON.stringify(info, null, 2), 'utf8');
}

export const getPackageInfo = (code: string) : PackageInfo | undefined => {
    const fileName = getFileName(code);
    if(!fs.existsSync(fileName))
        return undefined;

    return JSON.parse(fs.readFileSync(fileName, 'utf8')) as PackageInfo;
}
