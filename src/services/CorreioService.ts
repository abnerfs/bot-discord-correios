import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';
import { PackageInfo, PackageInfoStatus } from '../models';


const getPackageInfoBody = async (codigo: string) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www2.correios.com.br/sistemas/rastreamento/default.cfm', {
        waitUntil: 'networkidle0'
    });
    await page.waitForSelector('#objetos');
    await page.evaluate((tmpCode: string) => {
        const obj = document.querySelector('#objetos') as HTMLTextAreaElement | undefined;
        if(obj)
            obj.value = tmpCode;
    }, codigo);

    await page.click('#btnPesq');
    await page.waitForSelector('.listEvent');
    const content = await page.evaluate(() => document.querySelector('body')?.innerHTML)

    await browser.close();
    return content;
}

const getPackageInfo = (body: string, code: string) : PackageInfo => {
    const dom = new JSDOM(body);

    const status = Array.prototype.slice.call(dom.window.document.querySelectorAll('.listEvent'))
        .map(row => {
            const dt = row.querySelector('.sroDtEvent').textContent
            const desc = row.querySelector('.sroLbEvent').textContent

            const status : PackageInfoStatus = {
                desc,
                dt
            };
            return status;
        });

    return {
        code,
        status
    };
}

export const getPackageCorreios = async (code: string) => {
    const body = await getPackageInfoBody(code);
    if(!body)
        throw new Error("Package not found");

    return getPackageInfo(body, code);
}