import TelegramBot from "node-telegram-bot-api";

interface MessageOriginUser {
    date: number;
    sender_user: TelegramBot.User;
    type: "user";
}

interface MessageOriginHiddenUser {
    date: number;
    sender_user_name: string;
    type: "hidden_user";
}

interface MessageOriginChat {
    author_signature?: string;
    date: number;
    sender_chat: TelegramBot.Chat;
    type: "chat";
}

interface MessageOriginChannel {
    author_signature?: string;
    chat: TelegramBot.Chat;
    date: number;
    message_id: number;
    type: "channel";
}

type MessageOrigin = MessageOriginUser | MessageOriginHiddenUser | MessageOriginChat | MessageOriginChannel;

interface PaidMediaPreview {
    duration?: number;
    height?: number;
    type: "preview";
    width?: number;
}

interface PaidMediaPhoto {
    photo: TelegramBot.PhotoSize[];
    type: "photo";
}

interface PaidMediaVideo {
    type: "video";
    video: TelegramBot.Video;
}

type PaidMedia = PaidMediaPreview | PaidMediaPhoto | PaidMediaVideo;

interface PaidMediaInfo {
    paid_media: PaidMedia[];
    star_count: number;
}

interface Story {
    chat: TelegramBot.Chat;
    id: number;
}


interface Message extends TelegramBot.Message {
    external_reply?: {
        animation?: TelegramBot.Animation;
        audio?: TelegramBot.Audio;
        chat?: TelegramBot.Chat;
        contact?: TelegramBot.Contact;
        dice?: TelegramBot.Dice;
        document?: TelegramBot.Document;
        game?: TelegramBot.Game;
        giveaway?: {
            chats: TelegramBot.Chat[];
            country_codes?: string[];
            has_public_winners?: true;
            only_new_members?: true;
            premium_subscription_month_count?: number;
            prize_description?: string;
            winner_count: number;
            winners_selection_date: number;
        };
        giveaway_winners?: {
            additional_chat_count?: number;
            chat: TelegramBot.Chat;
            giveaway_message_id: number;
            only_new_members?: true;
            premium_subscription_month_count?: number;
            prize_description?: string;
            unclaimed_prize_count?: number;
            was_refunded?: true;
            winner_count: number;
            winners: TelegramBot.User[];
            winners_selection_date: number;
        };
        has_media_spoiler?: true;
        invoice?: TelegramBot.Invoice;
        link_preview_options?: TelegramBot.LinkPreviewOptions;
        location?: TelegramBot.Location;
        message_id?: number;
        origin: MessageOrigin;
        paid_media?: PaidMediaInfo;
        photo?: TelegramBot.PhotoSize[];
        poll?: TelegramBot.Poll;
        sticker?: TelegramBot.Sticker;
        story?: Story;
        venue?: TelegramBot.Venue;
        video?: TelegramBot.Video;
        video_note?: TelegramBot.VideoNote;
        voice?: TelegramBot.Voice;
    }
}