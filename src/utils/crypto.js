import CryptoJS from 'crypto-js';

/**
 * Decrypts encrypted data using AES algorithm
 * @param {string} encryptedData - The encrypted data to decrypt
 * @returns {string} Decrypted plaintext
 */
export function decrypt(encryptedData) {
  // In production, use environment variables for the secret key
  const secretKey = import.meta.env.VITE_APP_CRYPTO_SECRET || 'default-dev-key';
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Encrypts data using AES algorithm
 * @param {string} plaintext - The data to encrypt
 * @returns {string} Encrypted data
 */
export function encrypt(plaintext) {
  const secretKey = import.meta.env.VITE_APP_CRYPTO_SECRET || 'default-dev-key';
  return CryptoJS.AES.encrypt(plaintext, secretKey).toString();
}