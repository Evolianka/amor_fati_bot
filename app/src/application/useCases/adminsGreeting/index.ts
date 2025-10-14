import {IMessagePresenter} from "@application/ports/Message";

interface Message {
    text: string;
    username: string;
    chatId: number | string;
}

export const adminsGreeting = (messagePresenter: IMessagePresenter, message: Message) => {
    const {text, username, chatId} = message;

    const preparedText = text.replace('{{ adminName }}', username.trim());

    return messagePresenter.send(preparedText, {chatId})
}