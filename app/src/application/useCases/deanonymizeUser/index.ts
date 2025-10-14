import {IEncryptor} from "@application/ports";

function base64urlDecode(input: string) {
    // Replace URL-safe characters back to standard Base64 characters
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding back if necessary (Base64 requires padding to be a multiple of 4)
    const paddingNeeded = base64.length % 4;
    if (paddingNeeded) {
        base64 += '==='.slice(0, 4 - paddingNeeded);
    }

    // Use atob() to decode the standard Base64 string
    const decodedString = atob(base64);

    // Convert the decoded string to a Uint8Array for proper UTF-8 handling
    const bytes = Uint8Array.from(decodedString, char => char.charCodeAt(0));

    // Use TextDecoder to convert bytes to a human-readable string
    return new TextDecoder().decode(bytes);
}

export const deanonymizeUser = async (originText: string, encryptorPresenter: IEncryptor): Promise<string | false> => {
    return false
}