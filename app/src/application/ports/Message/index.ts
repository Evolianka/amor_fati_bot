import {Context, InlineKeyboard,} from "grammy";
import {InputMediaPhoto, InputMediaAudio, InputMediaDocument, InputMediaVideo } from "grammy/types";
import {Message} from "@grammyjs/types/message.js";
import {TMediaMessage} from "@application/dto/IMediaMessage";



export type TInputMedia = InputMediaPhoto | InputMediaAudio | InputMediaDocument | InputMediaVideo | TMediaMessage

interface SendMessageConfig {
    chatId: number | string;
}

interface ISettings {
    parse_mode?: 'HTML' | 'MarkdownV2' | 'Markdown';
    isExistingMedia?: boolean;
    reply_to_message_id?: number;
    reply_markup?: InlineKeyboard;
}

export interface ISend {
    (message: string | TMediaMessage | TMediaMessage[], config: SendMessageConfig, settings?: ISettings):  Promise<Message | Message[]>
}

export interface IPrepareMediaMessage {
    (message: TMediaMessage, settings?: ISettings): TInputMedia
}

export interface IMessagePresenter {
    send: ISend;
    prepareMediaMessage: IPrepareMediaMessage;
}

export interface IEnvConfig {
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

export interface IMakeMessagePresenter {
    (ctx: Context, envConfig: IEnvConfig): IMessagePresenter;
}