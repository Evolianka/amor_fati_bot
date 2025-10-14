export interface IConfig {
    roleId: string;
    secretId: string;
    vaultAddress: string;
}

export interface IEncryptResponse {
    request_id: string,
    lease_id: string,
    renewable: boolean,
    lease_duration: number,
    data: {
        ciphertext: string,
        key_version: number
    },
    wrap_info: null,
    warnings: null,
    auth: null,
    mount_type: string
}


export interface IEncrypt {
    <T>(data: T):  Promise<IEncryptResponse>;
}

export interface ILogin {
    (): Promise<void>;
}

export interface IDecrypt {
    (data: string): Promise<string>;
}

type TJsonPrimitive = string | number | boolean | null;
type TJsonValue = TJsonPrimitive | IJsonObject | IJsonArray;
interface IJsonObject { [k: string]: TJsonValue }
interface IJsonArray extends Array<TJsonValue> {}

export interface IReqBody {
    [key: string]: TJsonValue
}

export interface IReqOptions<T> extends Omit<RequestInit, "body"> {
    body?: T | IReqBody | RequestInit["body"];
}

export interface IMakeRequest {
    <T, V>(path: string, options: IReqOptions<V>): Promise<T>;
}

export interface IEncryptor {
    roleId: string;
    secretId: string;
    vaultAddress: string;
    vaultToken: string;

    encrypt: IEncrypt;
    decrypt: IDecrypt;
    login: ILogin;
    makeRequest: IMakeRequest;
}

export interface IMakeEncryptor {
    (config: IConfig): IEncryptor;
}