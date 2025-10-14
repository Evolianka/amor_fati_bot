import {ReadStream} from "node:fs";

interface IBaseInputMedia {
    type: string;
    media: string | ReadStream;
    caption?: string;
}

export const createMediaGroup = (media: IBaseInputMedia[]) => {
    const mediaGroup = media.map((file, index) => {
        return {
            type: file.type,
            media: typeof file.media === 'string' ? file.media : file.media.path,
            caption: file.caption
        }
    })

    return mediaGroup as IBaseInputMedia[];
}