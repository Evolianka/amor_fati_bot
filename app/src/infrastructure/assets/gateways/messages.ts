import {resolveSingleFile, FileParamsOverload1, ResolverResponseOverload1} from "@infrastructure/_shared/resolveSingleFile";


const messagesMap = {
    ru: {
        greeting: require.resolve('#root/src/assets/messages/ru/greeting.md'),
        instruction: require.resolve('#root/src/assets/messages/ru/instruction.md'),
        details: require.resolve('#root/src/assets/messages/ru/details.md'),
    }
};

function getMessage(params: FileParamsOverload1): ResolverResponseOverload1;
function getMessage(params: FileParamsOverload1[]): ResolverResponseOverload1[];

function getMessage(params: FileParamsOverload1 | FileParamsOverload1[]) {
    if (Array.isArray(params)) {
        return params.map((p) => resolveSingleFile(p, messagesMap));
    }

    return resolveSingleFile(params, messagesMap);
}

export const messagesGateway = { getMessage };