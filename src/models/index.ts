
export type PackageInfoStatus = {
    dt: string;
    desc: string;
}

export type PackageInfo = {
    code: string;
    status: PackageInfoStatus[]
}