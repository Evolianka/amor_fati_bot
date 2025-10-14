import path from "path";
import {
    resolveSingleFile,
    ResolverResponseOverload1,
    FileParamsOverload1
} from "@infrastructure/_shared/resolveSingleFile";
const imagesMap = {
    instruction: {
        ru: {
            1: require.resolve('#root/src/assets/images/instruction/ru/1.png'),
            2: require.resolve('#root/src/assets/images/instruction/ru/2.png'),
            3: require.resolve('#root/src/assets/images/instruction/ru/3.png'),
            4: require.resolve('#root/src/assets/images/instruction/ru/4.png'),
        }
    }
}

function getImage(params: FileParamsOverload1): ResolverResponseOverload1;
function getImage(params: FileParamsOverload1[]): ResolverResponseOverload1[];

function getImage(params: FileParamsOverload1 | FileParamsOverload1[]) {
   console.log()
    if (Array.isArray(params)) {
        return params.map(p => resolveSingleFile(p, imagesMap));
    }

    return resolveSingleFile(params, imagesMap);
}

export const imagesGateway = { getImage };