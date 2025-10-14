import * as K from './types/environment'

import dotenv from 'dotenv';
import path from 'path';
import {Bot} from "grammy";
import {router} from "@interfaces/telegram/router";
const env = process.env.NODE_ENV || 'local';
const envPath = path.resolve(__dirname, `../.env.${env}`);
dotenv.config({path: envPath});

const {AFB_TOKEN} = process.env;

if (!AFB_TOKEN) {
    throw new Error('No token provided');
}

const envConfig = {
    adminsId: process.env.AFB_ADMINS_ID,
    channelsId: process.env.AFB_CHANNELS_ID,
    chatsId: process.env.AFB_CHATS_ID,
    saltLength: process.env.SALT_LENGTH,
    saltPosition: process.env.SALT_POSITION,
    hashLength: process.env.HASH_LENGTH,
    hashSecretKey: process.env.HASH_SECRET_KEY,
    roleId: process.env.ROLE_ID,
    secretId: process.env.SECRET_ID,
    vaultAddress: process.env.VAULT_ADDRESS,
    afbBufferGroup: process.env.AFB_BUFFER_GROUP,
    afbBufferThread: process.env.AFB_BUFFER_THREAD,
    afbModeratorId: process.env.AFB_MODERATOR_ID
}

const bot = new Bot(AFB_TOKEN);


router(bot, envConfig);
// Опционально: лог о старте
// bot.on("message", (ctx) => {
//     router(ctx, envConfig);
// });
console.log(`Bot started in ${env} mode`);

bot.start()