import {IEncryptResponse, IMakeEncryptor, IReqOptions} from "@application/ports/Encryptor";

interface IDecryptBody {
    plaintext: string;
}

interface IEncryptBody {
    plaintext: string;
}

export const makeEncryptor: IMakeEncryptor = (config) => {
    const {roleId, secretId, vaultAddress} = config;

    return {
        roleId,
        secretId,
        vaultAddress,
        vaultToken: "",

        async login() {
            const r = await fetch(`${this.vaultAddress}/v1/auth/approle/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role_id: this.roleId, secret_id: this.secretId })
            });

            if (!r.ok) {
                throw r;
            }

            const data = await r.json();
            this.vaultToken = data.auth.client_token;
            return
        },
        async makeRequest<T, V>(path: string, options: IReqOptions<V>) {
            const res = await fetch(`${this.vaultAddress}/v1/${path}`, {
                method: options.method,
                headers: { "X-Vault-Token": this.vaultToken, "Content-Type": "application/json" },
                body: options.body ? JSON.stringify(options.body) : undefined,
            });
            if (!res.ok) {
                console.log(res)
                console.log(this.vaultToken)
                throw res
            }
            return await res.json() as Promise<T>;
        },
        async encrypt(data) {
            const plaintext = Buffer.from(JSON.stringify(data), "utf8").toString("base64");
            return await this.makeRequest<IEncryptResponse, IEncryptBody>(`transit/encrypt/bot-signatures`, {
                body: {plaintext},
                method: "POST"
            });
        },

        async decrypt(data) {
            return await this.makeRequest<string, IDecryptBody>(`transit/decrypt/bot-signatures`, {
                body: {plaintext: data},
                method: "POST"
            });
        }
    }
}