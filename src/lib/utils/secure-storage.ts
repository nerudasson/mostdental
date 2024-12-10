import { generateEncryptionKey, encryptFile, decryptFile } from './encryption';

interface SecureFileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  encryptionKey: string;
  iv: string;
  senderId: string;
  receiverId: string;
  patientId?: string;
  createdAt: Date;
  expiresAt: Date;
}

class SecureStorage {
  private static instance: SecureStorage;
  private files: Map<string, { data: string; metadata: SecureFileMetadata }>;

  private constructor() {
    this.files = new Map();
  }

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  async storeFile(
    file: File,
    senderId: string,
    receiverId: string,
    patientId?: string
  ): Promise<SecureFileMetadata> {
    // Generate unique encryption key for this file
    const encryptionKey = generateEncryptionKey();
    
    // Encrypt file
    const { encryptedData, metadata } = await encryptFile(file, encryptionKey);
    
    // Create metadata
    const fileMetadata: SecureFileMetadata = {
      id: crypto.randomUUID(),
      name: metadata.name,
      type: metadata.type,
      size: metadata.size,
      encryptionKey,
      iv: crypto.randomUUID(), // In a real app, use proper IV
      senderId,
      receiverId,
      patientId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // Store encrypted file and metadata
    this.files.set(fileMetadata.id, {
      data: encryptedData,
      metadata: fileMetadata,
    });

    return fileMetadata;
  }

  async retrieveFile(fileId: string, userId: string): Promise<File | null> {
    const fileEntry = this.files.get(fileId);
    if (!fileEntry) return null;

    // Verify user has access
    if (fileEntry.metadata.receiverId !== userId && fileEntry.metadata.senderId !== userId) {
      throw new Error('Unauthorized access');
    }

    // Check if file has expired
    if (new Date() > fileEntry.metadata.expiresAt) {
      this.files.delete(fileId);
      throw new Error('File has expired');
    }

    // Decrypt and return file
    return decryptFile(
      fileEntry.data,
      fileEntry.metadata.encryptionKey,
      {
        name: fileEntry.metadata.name,
        type: fileEntry.metadata.type,
      }
    );
  }

  getMetadata(fileId: string): SecureFileMetadata | null {
    return this.files.get(fileId)?.metadata || null;
  }

  listFiles(userId: string): SecureFileMetadata[] {
    const userFiles: SecureFileMetadata[] = [];
    
    for (const [_, { metadata }] of this.files) {
      if (metadata.receiverId === userId || metadata.senderId === userId) {
        userFiles.push(metadata);
      }
    }
    
    return userFiles;
  }

  deleteFile(fileId: string, userId: string): boolean {
    const fileEntry = this.files.get(fileId);
    if (!fileEntry) return false;

    // Verify user has access
    if (fileEntry.metadata.receiverId !== userId && fileEntry.metadata.senderId !== userId) {
      throw new Error('Unauthorized access');
    }

    return this.files.delete(fileId);
  }

  // Cleanup expired files
  cleanup(): void {
    const now = new Date();
    for (const [id, { metadata }] of this.files) {
      if (now > metadata.expiresAt) {
        this.files.delete(id);
      }
    }
  }
}

// Run cleanup every hour
setInterval(() => {
  SecureStorage.getInstance().cleanup();
}, 60 * 60 * 1000);

export const secureStorage = SecureStorage.getInstance();