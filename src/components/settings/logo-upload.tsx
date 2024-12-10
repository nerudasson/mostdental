import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useProfileStore } from '@/stores/profile-store';

export function LogoUpload() {
  const { toast } = useToast();
  const { logo, setLogo } = useProfileStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(logo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        throw new Error('Image must be less than 2MB');
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setLogo(base64String);
      };
      reader.readAsDataURL(file);

      toast({
        title: 'Logo updated',
        description: 'Your logo has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update logo',
        variant: 'destructive',
      });
    }

    // Reset input
    event.target.value = '';
  };

  const handleRemove = () => {
    setLogo(null);
    setPreviewUrl(null);
    toast({
      title: 'Logo removed',
      description: 'Your logo has been removed.',
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">Logo</h3>
            <p className="text-sm text-muted-foreground">
              Upload your practice or lab logo
            </p>
          </div>
          {previewUrl && (
            <Button variant="outline" size="sm" onClick={handleRemove}>
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>

        {previewUrl ? (
          <div className="relative w-40 h-40 rounded-lg border overflow-hidden">
            <img
              src={previewUrl}
              alt="Logo preview"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-40 h-40 border-dashed"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Upload logo</span>
            </div>
          </Button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="text-xs text-muted-foreground">
          Recommended: Square image, at least 200x200px, max 2MB
        </div>
      </div>
    </Card>
  );
}