import {IMessagePresenter} from "@application/ports/Message";
import {TMediaMessage} from "@application/dto/IMediaMessage";

interface Props {
    chatId: number | string;
    messages: [string, TMediaMessage[]]
}

export const start = (messagePresenter: IMessagePresenter, props: Props) => {
    const {chatId, messages} = props;

    const messagePromises: ReturnType<typeof messagePresenter.send>[] = [];

    for (const message of messages) {
        messagePromises.push(messagePresenter.send(message, {chatId}));
    }

    return messagePromises
}