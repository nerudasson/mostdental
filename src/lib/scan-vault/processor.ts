import path from 'path';
import fs from 'fs/promises';
import { VaultedScan, ProcessingConfig, ProcessingResult } from './types';
import { IndicationType } from '../scanner/types';

export class ScanProcessor {
  constructor(private config: ProcessingConfig) {}

  async processScan(scan: VaultedScan): Promise<ProcessingResult> {
    try {
      // Determine target software based on indication
      const targetSoftware = this.determineTargetSoftware(scan);
      if (!targetSoftware) {
        throw new Error('No suitable design software configured for this indication');
      }

      // Create target directory structure
      const targetDir = await this.createTargetDirectory(scan);

      // Copy files to target location
      const processedFiles = await this.copyFiles(scan, targetDir);

      // Generate auxiliary files (XML/JSON)
      if (targetSoftware === 'threeshape' && this.config.threeshape?.createXml) {
        await this.generateThreeShapeXml(scan, targetDir);
      } else if (targetSoftware === 'exocad' && this.config.exocad?.createJson) {
        await this.generateExocadJson(scan, targetDir);
      }

      return {
        success: true,
        targetLocation: targetDir,
        processedFiles
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processedFiles: []
      };
    }
  }

  private determineTargetSoftware(scan: VaultedScan): 'threeshape' | 'exocad' | null {
    // Default mappings if no specific indication
    if (!scan.metadata.indication) {
      return this.config.threeshape?.enabled ? 'threeshape' : 
             this.config.exocad?.enabled ? 'exocad' : null;
    }

    // Specific mappings per indication
    switch (scan.metadata.indication) {
      case IndicationType.CROWN:
      case IndicationType.BRIDGE:
        return this.config.threeshape?.enabled ? 'threeshape' : 'exocad';
      
      case IndicationType.IMPLANT:
        return this.config.exocad?.enabled ? 'exocad' : 'threeshape';
      
      default:
        return this.config.threeshape?.enabled ? 'threeshape' : 'exocad';
    }
  }

  private async createTargetDirectory(scan: VaultedScan): Promise<string> {
    const { folderStructure } = this.config;
    const basePath = this.getBasePath(scan);

    let targetPath = folderStructure.namingPattern
      .replace('{practice}', this.sanitizePath(scan.dentistName))
      .replace('{patientId}', this.sanitizePath(scan.patientId))
      .replace('{caseId}', scan.matchedOrderId || scan.id);

    targetPath = path.join(basePath, targetPath);

    await fs.mkdir(targetPath, { recursive: true });
    return targetPath;
  }

  private getBasePath(scan: VaultedScan): string {
    const software = this.determineTargetSoftware(scan);
    return software === 'threeshape' 
      ? this.config.threeshape!.importLocation
      : this.config.exocad!.importLocation;
  }

  private async copyFiles(
    scan: VaultedScan,
    targetDir: string
  ): Promise<string[]> {
    const processedFiles: string[] = [];

    for (const file of scan.files) {
      const targetPath = path.join(targetDir, file.name);
      await fs.copyFile(file.path, targetPath);
      processedFiles.push(targetPath);
    }

    return processedFiles;
  }

  private async generateThreeShapeXml(
    scan: VaultedScan,
    targetDir: string
  ): Promise<void> {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<trios-order>
  <patient>
    <id>${scan.patientId}</id>
    <name>${scan.patientName}</name>
  </patient>
  <dentist>
    <name>${scan.dentistName}</name>
  </dentist>
  <case>
    <id>${scan.matchedOrderId || scan.id}</id>
    <indication>${scan.metadata.indication || ''}</indication>
    <teeth>${scan.metadata.teeth?.join(',') || ''}</teeth>
    <notes>${scan.metadata.notes || ''}</notes>
  </case>
</trios-order>`;

    await fs.writeFile(
      path.join(targetDir, 'order.xml'),
      xmlContent,
      'utf-8'
    );
  }

  private async generateExocadJson(
    scan: VaultedScan,
    targetDir: string
  ): Promise<void> {
    const jsonContent = {
      patient: {
        id: scan.patientId,
        name: scan.patientName
      },
      dentist: {
        name: scan.dentistName
      },
      case: {
        id: scan.matchedOrderId || scan.id,
        indication: scan.metadata.indication,
        teeth: scan.metadata.teeth,
        notes: scan.metadata.notes
      },
      files: scan.files.map(f => ({
        name: f.name,
        type: f.type
      }))
    };

    await fs.writeFile(
      path.join(targetDir, 'case.json'),
      JSON.stringify(jsonContent, null, 2),
      'utf-8'
    );
  }

  private sanitizePath(input: string): string {
    return input.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }
}