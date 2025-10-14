export interface IMediaMessage{
    type: string;
    media: string;
    caption?: string;
    show_caption_above_media?: boolean;
    media_group_id?: number;
    isExistingMedia?: boolean;
    reply_to_message_id?: string | number;
    reply_markup: {text: string, callback_data: string}[];
    parse_mode?: 'HTML' | 'MarkdownV2' | 'Markdown';
    caption_entities?: {
        offset: number;
        length: number;
        type: "custom_emoji";
        custom_emoji_id: string;
    }[];
}

export interface IMediaMessagePhoto extends IMediaMessage {
    type: 'photo';
}

export interface IMediaMessageVideo extends IMediaMessage {
    type:  'video';
}

export interface IMediaMessageAudio extends IMediaMessage {
    type: 'audio';
}

export interface IMediaMessageDocument extends IMediaMessage {
    type: 'document';
}

export type TMediaMessage = IMediaMessagePhoto | IMediaMessageAudio | IMediaMessageDocument | IMediaMessageVideo