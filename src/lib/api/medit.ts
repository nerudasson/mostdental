import axios from 'axios';

const MEDIT_API_URL = 'https://dev-openapi-auth.meditlink.com';

interface MeditAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface MeditScanner {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  lastSync?: Date;
  status: 'online' | 'offline';
}

interface MeditScan {
  id: string;
  patientId: string;
  createdAt: Date;
  type: string;
  files: {
    id: string;
    name: string;
    url: string;
  }[];
}

export class MeditAPI {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: Date | null = null;

  constructor(private clientId: string, private clientSecret: string) {}

  private async authenticate() {
    try {
      const response = await axios.post<MeditAuthResponse>(
        `${MEDIT_API_URL}/oauth/token`,
        {
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }
      );

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      this.expiresAt = new Date(Date.now() + response.data.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Medit authentication failed:', error);
      throw new Error('Failed to authenticate with Medit API');
    }
  }

  private async getAuthToken() {
    if (!this.accessToken || !this.expiresAt || this.expiresAt < new Date()) {
      await this.authenticate();
    }
    return this.accessToken;
  }

  async getScanners(): Promise<MeditScanner[]> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.get(`${MEDIT_API_URL}/scanners`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch scanners:', error);
      throw new Error('Failed to fetch scanners');
    }
  }

  async getScans(patientId: string): Promise<MeditScan[]> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.get(
        `${MEDIT_API_URL}/patients/${patientId}/scans`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch scans:', error);
      throw new Error('Failed to fetch scans');
    }
  }

  async downloadScan(scanId: string, fileId: string): Promise<Blob> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.get(
        `${MEDIT_API_URL}/scans/${scanId}/files/${fileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to download scan:', error);
      throw new Error('Failed to download scan');
    }
  }
}