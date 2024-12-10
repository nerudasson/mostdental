import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { secureStorage } from '@/lib/utils/secure-storage';

interface SecureTransferStore {
  sendFiles: (params: {
    files: File[];
    labId: string;
    patientId?: string;
  }) => Promise<void>;
  downloadFile: (fileId: string, userId: string) => Promise<File>;
  getFiles: (userId: string) => any[];
}

export const useSecureTransfer = create<SecureTransferStore>()((set, get) => ({
  sendFiles: async ({ files, labId, patientId }) => {
    const senderId = '1'; // In real app, get from auth context
    
    // Store each file securely
    for (const file of files) {
      await secureStorage.storeFile(file, senderId, labId, patientId);
    }
  },
  
  downloadFile: async (fileId: string, userId: string) => {
    const file = await secureStorage.retrieveFile(fileId, userId);
    if (!file) {
      throw new Error('File not found');
    }
    return file;
  },
  
  getFiles: (userId: string) => {
    return secureStorage.listFiles(userId);
  },
}));