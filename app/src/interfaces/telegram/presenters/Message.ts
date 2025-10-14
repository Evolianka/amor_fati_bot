import {IMakeMessagePresenter} from "@application/ports/Message";
import {InlineKeyboard, InputFile, InputMediaBuilder} from "grammy";

export const makeMessagePresenter: IMakeMessagePresenter = (ctx, envConfig) => {

    return {
        prepareMediaMessage(mediaData, settings) {
            const {show_caption_above_media, media, caption, caption_entities, type} = mediaData;

            if (settings?.isExistingMedia) {
                mediaData.parse_mode = settings?.parse_mode;
                return mediaData;
            }

            const inputFile = new InputFile(media);

            return InputMediaBuilder.photo(inputFile, {
                caption,
                show_caption_above_media,
                parse_mode: settings?.parse_mode,
                caption_entities
            });
        },

        send(message, config, settings = {}) {
            const {chatId} = config;

            if (Array.isArray(message)) {
                const preparedMessages = message.map((item) => {
                    return this.prepareMediaMessage(item, settings);
                })

                console.log(preparedMessages)

                if (envConfig.channelsId.includes(Number(chatId)) || envConfig.chatsId.includes(Number(chatId))) {
                    const reply_markup = new InlineKeyboard()
                        .text('Бан', 'ban')
                        .text('Удалить', 'delete')
                        .text('Мут', 'mute')
                        .row()
                        .text('Предупредить', 'warn');

                    const preparedMessages = message.map((item) => {
                        return this.prepareMediaMessage(item, settings);
                    })

                    ctx.api.sendMediaGroup(envConfig.afbModeratorId, preparedMessages, {
                        reply_parameters: {
                            message_id: settings?.reply_to_message_id || 0,
                            chat_id: chatId
                        }
                    })

                    ctx.api.sendMessage(envConfig.afbModeratorId, preparedMessages[0].caption || '', {
                        reply_markup
                    })
                }

                return ctx.api.sendMediaGroup(chatId, preparedMessages, {
                    reply_to_message_id: settings?.reply_to_message_id
                })
            }

            if (typeof message !== 'string') {
                if (envConfig.channelsId.includes(Number(chatId)) || envConfig.chatsId.includes(Number(chatId))) {
                    const reply_markup = new InlineKeyboard()
                        .text('Бан', 'ban')
                        .text('Удалить', 'delete')
                        .text('Мут', 'mute')
                        .row()
                        .text('Предупредить', 'warn');

                    const preparedMessage = this.prepareMediaMessage(message, settings);

                    ctx.api.sendMediaGroup(envConfig.afbModeratorId, [preparedMessage], {
                        reply_parameters: {
                            message_id: settings?.reply_to_message_id || 0,
                            chat_id: chatId
                        }
                    });

                    ctx.api.sendMessage(envConfig.afbModeratorId, preparedMessage.caption || '', {
                        reply_markup
                    })
                }

                const preparedMessage = this.prepareMediaMessage(message, settings);

                return ctx.api.sendMediaGroup(chatId, [preparedMessage], {
                    reply_to_message_id: settings?.reply_to_message_id
                });
            }

            if (envConfig.channelsId.includes(Number(chatId)) || envConfig.chatsId.includes(Number(chatId))) {
                const reply_markup = new InlineKeyboard()
                    .text('Бан', 'ban')
                    .text('Удалить', 'delete')
                    .text('Мут', 'mute')
                    .row()
                    .text('Предупредить', 'warn');


                ctx.api.sendMessage(envConfig.afbModeratorId, message, {
                    ...settings,
                    reply_markup,
                    reply_parameters: {
                        message_id: settings?.reply_to_message_id || 0,
                        chat_id: chatId
                    }
                })
            }

            return ctx.api.sendMessage(chatId, message, settings);
        }
    }
}