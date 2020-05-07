
export type PackageInfoStatus = {
    id?: number;
    date: Date;
    description: string;
}

export type PackageInfo = {
    id?: number;
    code: string;
    description: string;
    status: PackageInfoStatus[]
}