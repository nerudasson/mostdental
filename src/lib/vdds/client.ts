import { VDDSConfig, VDDSPatient, vddsPatientSchema } from './types';

export class VDDSClient {
  private config: VDDSConfig;
  private connected: boolean = false;

  constructor(config: VDDSConfig) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      // Attempt to connect to VDDS server
      const response = await fetch(`http://${this.config.host}:${this.config.port}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          practiceId: this.config.practice.id,
          practiceName: this.config.practice.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to VDDS server');
      }

      this.connected = true;
      return true;
    } catch (error) {
      console.error('VDDS connection error:', error);
      this.connected = false;
      throw error;
    }
  }

  async searchPatients(query: string): Promise<VDDSPatient[]> {
    if (!this.connected) {
      throw new Error('Not connected to VDDS server');
    }

    try {
      const response = await fetch(`http://${this.config.host}:${this.config.port}/patients/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to search patients');
      }

      const data = await response.json();
      return data.map((patient: any) => vddsPatientSchema.parse(patient));
    } catch (error) {
      console.error('VDDS patient search error:', error);
      throw error;
    }
  }

  async getPatientBefunde(patientId: string): Promise<Record<string, string>> {
    if (!this.connected) {
      throw new Error('Not connected to VDDS server');
    }

    try {
      const response = await fetch(
        `http://${this.config.host}:${this.config.port}/patients/${patientId}/befunde`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch patient Befunde');
      }

      const data = await response.json();
      return data.befunde;
    } catch (error) {
      console.error('VDDS Befunde fetch error:', error);
      throw error;
    }
  }

  disconnect(): void {
    this.connected = false;
  }
}