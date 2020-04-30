const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const CODIGO = "PW769258045BR";

const getBody = async (codigo) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www2.correios.com.br/sistemas/rastreamento/default.cfm', {
        waitUntil: 'networkidle0'
    });
    await page.waitForSelector('#objetos');
    await page.evaluate((codigo) => {
        document.querySelector('#objetos').value = codigo;
    }, codigo);

    await page.click('#btnPesq');
    await page.waitForSelector('.listEvent');
    const content = await page.evaluate(() => {
        return document.querySelector('body').innerHTML;
    })

    await browser.close();
    return content;
};

const getInfoPackage = async (body, codigo) => {
    const dom = new JSDOM(body);

    const status = Array.prototype.slice.call(dom.window.document.querySelectorAll('.listEvent'))
        .map(row => {
            const dt = row.querySelector('.sroDtEvent').textContent
            const descricao = row.querySelector('.sroLbEvent').textContent

            return {
                dt,
                descricao
            }
        });

    return {
        codigo,
        status
    };
}

const getFileName = (codigo) => `${__dirname}/data/${codigo}.json`;

const getPackageInfo = (codigo) => {
    const fileName = getFileName(codigo);
    if(!fs.existsSync(fileName))
        return undefined;

    return JSON.parse(fs.readFileSync(fileName, 'utf8'));
}

const savePackageInfo = (info) => {
    const fileName = getFileName(info.codigo);
    fs.writeFileSync(fileName, JSON.stringify(info, null, 2), 'utf8');
}

const getLast = (arr) => arr.length ? arr[arr.length -1] : undefined;

const statusChanged = async (lastStatus, codigo) => {
    console.log(`Novo status ${codigo}: ${lastStatus.descricao} `);
}

const start = async (codigo) => {

    const infoSaved = getPackageInfo(codigo);

    const body = await getBody(codigo);
    const info = await getInfoPackage(body, codigo);

    const lastStatus = getLast(info.status);
    const lastStatusSaved = infoSaved ? getLast(infoSaved.status) : undefined;

    if(!lastStatusSaved 
        || !lastStatusSaved.descricao 
        || (lastStatus.descricao != lastStatusSaved.descricao) )
        await statusChanged(lastStatus, codigo);

    savePackageInfo(info);
};

start(CODIGO);


