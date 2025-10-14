// @ts-nocheck
import {Bot} from "grammy";
import {Message} from "@grammyjs/types";
import RAW_DICT from "@interfaces/telegram/messages/ru/index.json";
import {prepareMessages} from "@interfaces/telegram/messages/prepare-messages";
import {makeMessagePresenter} from "@interfaces/telegram/presenters";
import {
    start,
    adminsGreeting,
    details,
    anonymizeUser, deanonymizeUser
} from "@application/useCases";
import {makeEncryptor} from "@interfaces/telegram/presenters";


const DICT = prepareMessages(RAW_DICT as typeof RAW_DICT);

interface envConfig {
    adminsId: number[]
    channelsId: number[]
    chatsId: number[]
    saltLength: number
    saltPosition: number
    hashLength: number
    hashSecretKey: string
    roleId: string
    secretId: string
    vaultAddress: string
    afbBufferGroup: string
    afbBufferThread: string
    afbModeratorId: number
}

const config = {
    "-1002539054647": "-1002603288559",
}

const isReplyToMessageFromAmorFatum = (msg: Message) => {
    if (!msg.external_reply) {
        return false
    }

    const {external_reply} = msg;

    const chatGroups = Object.values(config);
    const originId = String(external_reply.chat?.id);



    if (!((String(originId) in config) || chatGroups.includes(String(originId)))) {
        return false
    }

    return true
}

const isMyMessage = async (msg: Message, bot: Bot) => {
    if (!msg.external_reply) {
        return
    }

    const {external_reply} = msg;

    if (!external_reply?.origin) {
        return;
    }

    if (!external_reply.origin.sender_user) {
        return;
    }

    const {sender_user} = external_reply.origin;


    const me = await bot.api.getMe()

    return sender_user.id === me.id && sender_user.username === me.username && sender_user.is_bot;


}

export const router = (bot: Bot, envConfig: envConfig) => {

    bot.on('message', async (ctx) => {
        const {message, from} = ctx;

        if (!message || !from || !message.chat || message.from.is_bot) {
            return
        }

        console.log(message)
        console.log(message.external_reply)
        console.log(isReplyToMessageFromAmorFatum(message))

        if (!message.external_reply) {
            return
        }

        if (!isReplyToMessageFromAmorFatum(message)) {
            return
        }

        const messagePresenter = makeMessagePresenter(ctx, envConfig);
        const encryptor = makeEncryptor({
            roleId: envConfig.roleId,
            secretId: envConfig.secretId,
            vaultAddress: envConfig.vaultAddress
        });

        const presenters = {
            messagePresenter,
            encryptor
        };

        let type = 'photo';

        if ('audio' in message) {
            type = 'audio';
        }

        if ('video' in message) {
            type = 'video';
        }

        if ('document' in message) {
            type = 'document';
        }

        let media = '';

        if (type === 'photo' && Array.isArray(message.photo)) {
            media = message.photo[message.photo.length - 1].file_id;
        }

        if (type === 'photo' && !Array.isArray(message.photo) && message.photo) {
            media = message.photo.file_id;
        }

        if (type === 'audio' && message.audio) {
            media = message.audio.file_id;
        }

        if (type === 'video' && message.video) {
            media = message.video.file_id;
        }

        if (type === 'document' && message.document) {
            media = message.document.file_id;
        }

        const isMyMsg = await isMyMessage(message, bot);

        const reply_message_id = message.external_reply?.message_id;
        const reply_chat_id = message.external_reply?.chat?.id;

        if (isMyMsg) {
            const initialMessage = await ctx.api.forwardMessage(envConfig.afbBufferGroup, reply_chat_id, reply_message_id,  {
                message_thread_id: envConfig.afbBufferThread
            });

            const result = await deanonymizeUser(initialMessage.text, encryptor);
        }

        const sendedMessage = await anonymizeUser(presenters, {
            author_id: from.id,
            reply_message_id,
            reply_chat_id,
            message: {
                type,
                media,
                media_group_id: message.media_group_id,
                caption: message.caption,
                caption_entities: message.caption_entities,
                text: message.text
            }
        })

    });

    bot.command('start', (ctx) => {
        const messagePresenter = makeMessagePresenter(ctx);

        start(messagePresenter, {
            messages: [DICT.greeting.text, DICT.instruction],
            chatId: ctx.message.chat.id
        })

        return;
    });

    bot.command('details', (ctx) => {
        const messagePresenter = makeMessagePresenter(ctx);

        details(messagePresenter, {
            chatId: ctx.message.chat.id,
            message: DICT.details.text
        });

        return;
    });

    bot.on('message:text', (ctx) => {
        if (envConfig.adminsId.includes(ctx.message.from.id) && /^привет.?$/gmi.test(ctx.message.text ?? '')) {
            const messagePresenter = makeMessagePresenter(ctx);

            adminsGreeting(messagePresenter, {
                chatId: ctx.message.chat.id,
                text: DICT.adminsGreeting.text,
                username: ctx.message.from.first_name
            });

            return;
        }
    })

    // bot.on('message', (ctx) => {
    //     const {message, from} = ctx;
    //
    //     console.log(message)
    //     const messagePresenter = makeMessagePresenter(ctx);
    //     const encryptor = makeEncryptor({
    //         roleId: envConfig.roleId,
    //         secretId: envConfig.secretId,
    //         vaultAddress: envConfig.vaultAddress
    //     });
    //
    //     const presenters = {
    //         messagePresenter,
    //         encryptor
    //     }
    //
    //     if (message.photo && message.caption) {
    //         anonymizeUser(presenters, {
    //             id: from.id,
    //             message: {
    //                 type: 'photo',
    //                 media: message.photo[message.photo.length - 1].file_id,
    //                 caption: message.caption,
    //                 captionEntities: message.caption_entities
    //             }
    //         })
    //     }
    // })
}