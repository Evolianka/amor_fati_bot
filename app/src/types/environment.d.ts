declare global {
    namespace NodeJS {
        interface ProcessEnv {
            AFB_TOKEN: string;
            AFB_CHANNELS_ID: number[];
            AFB_CHATS_ID: number[];
            AFB_ADMINS_ID: number[];
            SALT_LENGTH: number;
            SALT_POSITION: number;
            HASH_LENGTH: number;
            HASH_SECRET_KEY: string;
            ROLE_ID: string;
            SECRET_ID: string;
            VAULT_ADDRESS: string;
            AFB_BUFFER_GROUP: string;
            AFB_BUFFER_THREAD: string;
            AFB_MODERATOR_ID: number
        }
    }
}

export {};