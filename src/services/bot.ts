import { Client } from 'discord.js';
import { checkPackageWithoutCN } from '../app';
import { PackageInfoStatus } from '../models';
import { dateToStr } from './util';

const { BOT_TOKEN, BOT_PREFIX } = process.env;

if (!BOT_PREFIX)
    throw new Error("Invalid bot prefix");

const client = new Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', async (message) => {
    if (!message.content.startsWith(BOT_PREFIX))
        return;

    const contentWithoutPrefix = message.content.replace(BOT_PREFIX, '');
    const msgSplit = contentWithoutPrefix.split(' ');

    const cmd = msgSplit[0];

    if (cmd.toUpperCase() == 'RASTREAR') {
        const packageCode = msgSplit[1];
        if(!packageCode)
            return message.reply('Informe o pacote a ser rastreado');

        message.reply(`Rastreando pacote: "${packageCode}" ...`);

        const info = await checkPackageWithoutCN(packageCode, message.channel.id, message.author.id);
        const lastStatus = info.status[0];
        return message.reply(`${dateToStr(lastStatus.date)} - ${lastStatus.description}`);
    }
    else if (cmd.toUpperCase() == 'STATUS') {
        const packageCode = msgSplit[1];
        if(!packageCode)
            return message.reply('Informe o pacote a ser rastreado');

    }

    return undefined;
});

export const sendStatusUpdate = (channelID: string, userID: string, status: PackageInfoStatus) => {
    //
}

export default () => {
    client.login(BOT_TOKEN);
}