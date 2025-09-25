import dotenv from 'dotenv';
import TelegramBot from "node-telegram-bot-api";

dotenv.config({ path: `../.env.${process.env.NODE_ENV}` });

const {AFB_TOKEN} = process.env;

if (!AFB_TOKEN) {
    throw new Error('No token provided');
}

const bot = new TelegramBot(AFB_TOKEN, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match?.[1] || 'Совпадений не найдено';

    bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Received your message');
});