// @ts-nocheck
import {IMessagePresenter, IEncryptor} from "@application/ports";
import {TMediaMessage} from "@application/dto/IMediaMessage";

interface IPresenters {
    messagePresenter: IMessagePresenter;
    encryptor: IEncryptor
}

interface ITextMessage {
    text: string;
}

interface IProps {
    author_id: number | string;
    reply_message_id: number | string;
    reply_chat_id: number | string;
    message: (ITextMessage | TMediaMessage);
}

interface IMediaGroupCell{
    messages: TMediaMessage[];
    author_id: number;
    sign: string;
    timeoutId: NodeJS.Timeout;
}

const mediaGroupsMap = new Map<number, IMediaGroupCell>();

const getSign = async (author_id: number | string, encryptor: IEncryptor) => {
    await encryptor.login();
    const encryptorResponse = await encryptor.encrypt({
        id: author_id,
    });

    return `\n\n[${Buffer.from(encryptorResponse.data.ciphertext, 'utf8').toString('base64url')}]`;
}

const timeoutCallback = (media_group_id: number | string, reply_chat_id: string | number, reply_message_id: number | string, messagePresenter: IMessagePresenter) => {
    const mediaGroup = mediaGroupsMap.get(media_group_id);

    if (mediaGroup) {

        return {
            forwardedMessage: messagePresenter.send(mediaGroup.messages, {
                chatId: reply_chat_id,
            }, {
                isExistingMedia: true,
                reply_to_message_id: reply_message_id
            }),

            copyOfSrcMessage: mediaGroup.messages
        }

    }

    mediaGroupsMap.delete(media_group_id);
}

const createSpoilerEntity = (text: string, sign: string) => {
    return {
        type: 'spoiler',
        offset:  text.indexOf(sign) + 2,
        length: sign.length - 2
    }
}

export const anonymizeUser = async (presenters: IPresenters, data: IProps) => {
    const {messagePresenter, encryptor} = presenters;
    const {message, author_id, reply_message_id, reply_chat_id} = data;

    console.log(reply_message_id, reply_chat_id)

    if (typeof message.media_group_id === 'number' || typeof message.media_group_id === 'string') {

        if (!mediaGroupsMap.has(message.media_group_id)) {
            const sign = await getSign(author_id, encryptor);
            message.caption = message.caption ? message.caption.trim() + sign : sign;

            const spoilerEntity = createSpoilerEntity(message.caption, sign);

            message.caption_entities = Array.isArray(message.caption_entities) ? [...message.caption_entities, spoilerEntity] : [spoilerEntity];

            mediaGroupsMap.set(message.media_group_id, {
                messages: [message],
                author_id: author_id,
                timeoutId: setTimeout(() => {
                    timeoutCallback(message.media_group_id, reply_chat_id, reply_message_id, messagePresenter);
                }, 500)
            })
            return
        }

        const mediaGroup = mediaGroupsMap.get(message.media_group_id);

        if (mediaGroup) {
            mediaGroup.messages.push(message);
            clearTimeout(mediaGroup.timeoutId);
            mediaGroup.timeoutId = setTimeout(() => {
               timeoutCallback(message.media_group_id, reply_chat_id, reply_message_id, messagePresenter);
            }, 500)
        }

        return
    }

    const sign = await getSign(author_id, encryptor);


    if (typeof message.text === 'string') {
        const preparedMessage = message.text.trim() + sign;
        const spoilerEntity = createSpoilerEntity(preparedMessage, sign)

        return {
            forwardedMessage: messagePresenter.send(preparedMessage, {chatId: reply_chat_id}, {
                isExistingMedia: true,
                entities: [spoilerEntity],
                reply_to_message_id: reply_message_id
            }),
            copyOfSrcMessage: preparedMessage
        }
    }

    if (message.media) {
        let caption_entities = message.caption_entities;
        const caption = message.caption ?  message.caption.trim() + sign : sign;

        const spoilerEntity = createSpoilerEntity(caption, sign)

        if (Array.isArray(caption_entities)) {
            caption_entities.push(spoilerEntity)
        } else {
            caption_entities = [spoilerEntity]
        }

        const preparedMessage = {
            ...message,
            caption,
            caption_entities
        }

        return {
            forwardedMessage: messagePresenter.send(preparedMessage, {chatId: reply_chat_id}, {
                isExistingMedia: true,
                reply_to_message_id: reply_message_id
            }),
            copyOfSrcMessage: preparedMessage
        }
    }

}