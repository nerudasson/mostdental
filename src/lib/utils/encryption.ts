import CryptoJS from 'crypto-js';

// Generate a random encryption key
export function generateEncryptionKey(): string {
  return CryptoJS.lib.WordArray.random(256/8).toString();
}

// Encrypt file data
export async function encryptFile(file: File, key: string): Promise<{ 
  encryptedData: string;
  metadata: {
    name: string;
    type: string;
    size: number;
  };
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(data);
        const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();
        
        resolve({
          encryptedData: encrypted,
          metadata: {
            name: file.name,
            type: file.type,
            size: file.size,
          },
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

// Decrypt file data
export function decryptFile(encryptedData: string, key: string, metadata: { name: string; type: string }): File {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
  const typedArray = convertWordArrayToUint8Array(decrypted);
  const blob = new Blob([typedArray], { type: metadata.type });
  return new File([blob], metadata.name, { type: metadata.type });
}

// Helper function to convert CryptoJS WordArray to Uint8Array
function convertWordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): Uint8Array {
  const arrayOfWords = wordArray.words;
  const length = wordArray.sigBytes;
  const uint8Array = new Uint8Array(length);
  
  for (let i = 0; i < length; i++) {
    const byte = (arrayOfWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    uint8Array[i] = byte;
  }
  
  return uint8Array;
}