import { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface StlUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
}

export function StlUpload({ onFilesSelected, maxFiles = 5 }: StlUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    // Check file type
    if (!file.name.toLowerCase().endsWith('.stl')) {
      throw new Error('Only STL files are allowed');
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('File size must be less than 50MB');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    try {
      // Check total number of files
      if (selectedFiles.length + files.length > maxFiles) {
        throw new Error(`Maximum ${maxFiles} files allowed`);
      }

      // Validate each file
      files.forEach(validateFile);

      // Add files to state
      setSelectedFiles(prev => [...prev, ...files]);
      onFilesSelected(files);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading files');
    }

    // Reset input
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="w-full border-dashed"
          onClick={() => document.getElementById('stl-upload')?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Select STL Files
        </Button>
        <input
          id="stl-upload"
          type="file"
          accept=".stl"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Maximum {maxFiles} files • STL format only • Up to 50MB per file
      </div>
    </div>
  );
}