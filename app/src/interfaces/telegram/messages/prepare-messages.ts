import {imagesGateway, messagesGateway} from "@infrastructure/assets/gateways";
import {IMediaMessage} from "@application/dto/IMediaMessage";
import {ITextMessage} from "@application/dto/ITextMessage";

export interface IRawTextMessage {
    text: string;
}

export interface IRawMediaMessage {
    type: string;
    media: string;
    caption?: string;
    show_caption_above_media?: boolean;
    keyboardMarkup?: [string, string][];
}

export type RawMessage = IRawTextMessage | IRawMediaMessage;

export interface RawMessages {
    [key: PropertyKey]: RawMessage | RawMessage[];
}

type PreparedValue<V> =
    V extends (infer U)[] ? PreparedValue<U>[] :
        V extends IRawMediaMessage ? IMediaMessage :
            V extends IRawTextMessage ? ITextMessage :
                never;

export type PreparedMessages<T extends RawMessages> = {
    [K in keyof T]: PreparedValue<T[K]>;
};

const MESSAGE_TYPE = 'file@message:/';
const ASSET_TYPE = 'file@asset:/';

const prepareTextMessage = (msg: IRawTextMessage) => {
    if (!msg.text.startsWith(MESSAGE_TYPE)) {
        return msg;
    }

    const {src} = messagesGateway.getMessage({
        key: msg.text.replace(MESSAGE_TYPE, ''),
        type: 'stringValue'
    });

    return {...msg, text: src};
};

const prepareMediaMessage = (msg: IRawMediaMessage) => {
    const result = <IRawMediaMessage>{...msg}

    const {src} = imagesGateway.getImage({
        key: msg.media.replace(ASSET_TYPE, ''),
        type: 'path'
    });

    result.media = src;

    if (msg.caption?.startsWith(MESSAGE_TYPE)) {
        const {src} = messagesGateway.getMessage({
            key: msg.caption.replace(MESSAGE_TYPE, ''),
            type: 'stringValue'
        });

        result.caption = src;
    }

    return result;
};

function prepare(msg: RawMessage) {
    if ('text' in msg) {
        return prepareTextMessage(msg);
    }

    if ('media' in msg) {
        return prepareMediaMessage(msg);
    }

    return msg;
}

export function prepareMessages<T extends RawMessages>(messages: T) {
    const result = <PreparedMessages<T>>{};

    for (const key in messages) {
        const value = messages[key];

        // @ts-ignore это никак не разрулить, потому что у передаваемого объекта произвольные ключи
        result[key] = Array.isArray(value) ? value.map(prepare) : prepare(value);
    }

    return result;
}