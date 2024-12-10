import { v4 as uuidv4 } from 'uuid';

// Session duration in minutes
const SESSION_DURATION = 15;

interface UploadSession {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  maxFileSize: number;
  allowedTypes: string[];
  uploadCount: number;
  maxUploads: number;
}

const sessions = new Map<string, UploadSession>();

export function createUploadSession(): UploadSession {
  const id = uuidv4();
  const now = new Date();
  const session: UploadSession = {
    id,
    createdAt: now,
    expiresAt: new Date(now.getTime() + SESSION_DURATION * 60000),
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/heic'],
    uploadCount: 0,
    maxUploads: 10,
  };

  sessions.set(id, session);
  return session;
}

export function getUploadSession(id: string): UploadSession | null {
  const session = sessions.get(id);
  if (!session) return null;

  // Check if session is expired
  if (new Date() > session.expiresAt) {
    sessions.delete(id);
    return null;
  }

  return session;
}

export function validateUpload(
  session: UploadSession,
  file: File
): { valid: boolean; error?: string } {
  // Check if session has reached upload limit
  if (session.uploadCount >= session.maxUploads) {
    return { valid: false, error: 'Upload limit reached for this session' };
  }

  // Check file size
  if (file.size > session.maxFileSize) {
    return { valid: false, error: 'File size exceeds maximum allowed size' };
  }

  // Check file type
  if (!session.allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }

  return { valid: true };
}

export function incrementUploadCount(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    session.uploadCount++;
    sessions.set(sessionId, session);
  }
}

// Cleanup expired sessions periodically
setInterval(() => {
  const now = new Date();
  for (const [id, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(id);
    }
  }
}, 60000); // Run every minute