import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';
import { PackageInfo, PackageInfoStatus } from '../models';
import { parseDateStr, replaceALL } from './util';


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
            const dt = row.querySelector('.sroDtEvent').textContent as string;
            const dtParsed = parseDateStr(dt);
            const desc = 
                replaceALL(replaceALL(row.querySelector('.sroLbEvent').textContent, '\r', ''), '\n', '').trim();

            const status : PackageInfoStatus = {
                description: desc,
                date: dtParsed
            };
            return status;
        });

    const lastStatus = status[0];

    const delivered = lastStatus.description.toUpperCase().indexOf('OBJETO ENTREGUE AO DESTINAT') > -1;
    console.log('Delivered: ' + delivered);

    return {
        code,
        status,
        description: '',
        delivered,
        channelID: '',
        userID: ''
    };
}

export const getPackageCorreios = async (code: string) => {
    const body = await getPackageInfoBody(code);
    if(!body)
        throw new Error("Package not found");

    return getPackageInfo(body, code);
}