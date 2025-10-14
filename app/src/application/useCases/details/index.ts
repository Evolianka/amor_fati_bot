import {IMessagePresenter} from "@application/ports/Message";

interface IProps {
    chatId: number | string;
    message: string;
}

export const details = (messagePresenter: IMessagePresenter, props: IProps) => {
    return messagePresenter.send(props.message, {chatId: props.chatId}, {parse_mode: 'Markdown'});
}