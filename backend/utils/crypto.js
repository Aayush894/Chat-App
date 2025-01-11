import crypto from 'crypto';
import { Buffer } from 'buffer';
const ENCRYPT_ALGO = 'aes-256-gcm';
const TAG_LENGTH_BIT = 128;  
const IV_LENGTH_BYTE = 12;
const SALT_LENGTH_BYTE = 16;
const UTF_8 = 'utf8';

async function getAESKeyFromPassword(password, salt) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 65536, 32, 'sha256', (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey);
        });
    });
}

async function getRandomNonce(numBytes) {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(numBytes, (err, buffer) => {
            if (err) reject(err);
            resolve(buffer);
        });
    });
}

async function encryptString(strToEncrypt, key) {
    let encryptedString = null;
    if (strToEncrypt && strToEncrypt.trim() !== '') {
        try {
            encryptedString = await encrypt(Buffer.from(strToEncrypt, UTF_8), key);
            console.log("Encrypted data: ", encryptedString);
            return encryptedString;
        } catch (e) {
            console.error("Error encrypting data", e);
        }
    }
    return encryptedString;
}

async function decryptString(strToDecrypt, key) {
    console.log("Decrypting data..., Providing Data", strToDecrypt);
    let dataString = '';
    if (strToDecrypt && strToDecrypt.trim() !== '') {
        try {
            dataString = await decrypt(strToDecrypt, key);
            console.log("Decrypted data: ", dataString);
            return dataString;
        } catch (e) {
            console.error("Error decrypting data", e);
        }
    }
    console.log("Decrypted data: ", dataString);    
    return dataString;
}
  
async function encrypt(pText, key) {
    const salt = await getRandomNonce(SALT_LENGTH_BYTE);
    const iv = await getRandomNonce(IV_LENGTH_BYTE);

    const aesKeyFromPassword = await getAESKeyFromPassword(key, salt);

    const cipher = crypto.createCipheriv(ENCRYPT_ALGO, aesKeyFromPassword, iv);

    const cipherText = Buffer.concat([cipher.update(pText), cipher.final()]);
    const authTag = cipher.getAuthTag(); 

    const cipherTextWithIvSaltAuthTag = Buffer.concat([iv, salt, cipherText, authTag]); 

    return cipherTextWithIvSaltAuthTag.toString('base64');
}

async function decrypt(cText, key) {
    const decode = Buffer.from(cText, 'base64');
    
    const iv = decode.slice(0, IV_LENGTH_BYTE);
    const salt = decode.slice(IV_LENGTH_BYTE, IV_LENGTH_BYTE + SALT_LENGTH_BYTE);
    const cipherText = decode.slice(IV_LENGTH_BYTE + SALT_LENGTH_BYTE, decode.length - TAG_LENGTH_BIT / 8);
    const authTag = decode.slice(decode.length - TAG_LENGTH_BIT / 8);  

    const aesKeyFromPassword = await getAESKeyFromPassword(key, salt);
 
    const decipher = crypto.createDecipheriv(ENCRYPT_ALGO, aesKeyFromPassword, iv);
    
    decipher.setAuthTag(authTag);  

    const plainText = Buffer.concat([decipher.update(cipherText), decipher.final()]);
    return plainText.toString(UTF_8);
}

export {
    encryptString,
    decryptString,
}
