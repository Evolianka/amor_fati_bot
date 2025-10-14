import {getItemByKeyFromMap} from "@infrastructure/_shared/getitemByKeyFromMap";
import fs from "fs";
import {ReadStream} from "node:fs";

export interface FileParamsOverload1 {
    key: string;
    type: 'path' | 'stringValue' | undefined;
}

export interface FileParamsOverload2 {
    key: string;
    type: 'readStream';
}

export type FileParams = FileParamsOverload1 | FileParamsOverload2;

export interface ResolverResponseOverload1 {
    src: string;
}

export interface ResolverResponseOverload2 {
    src: ReadStream;
}

export type ResolverResponse = ResolverResponseOverload1 | ResolverResponseOverload2;

function resolveSingleFile<M>(params: FileParamsOverload1, map: M) : ResolverResponseOverload1;
function resolveSingleFile<M>(params: FileParamsOverload2, map: M) : ResolverResponseOverload2;

function resolveSingleFile<M>(params: FileParams, map: M): ResolverResponse {
    const { type = 'path', key } = params;

    const element = getItemByKeyFromMap(map, key.split('.'));

    if (typeof element !== 'string') {
        throw new Error('Key is not valid');
    }

    if (type === 'stringValue') {
        return { src: fs.readFileSync(element, 'utf8') };
    }

    if (type === 'readStream') {
        return { src: fs.createReadStream(element) };
    }

    return { src: element };
}

export { resolveSingleFile };