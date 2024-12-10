import { useState } from 'react';
import { StlViewer } from 'react-stl-viewer';
import { Expand, Minimize, RotateCcw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ModelViewerProps {
  url?: string;
  onClose: () => void;
}

const style = {
  width: '100%',
  height: '500px',
};

export function ModelViewer({ url, onClose }: ModelViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // If no URL provided, show placeholder
  if (!url) {
    return (
      <Card className={isFullscreen ? 'fixed inset-4 z-50' : ''}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>3D Model Viewer</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>×</Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[500px] bg-muted rounded-lg">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No STL file available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleRotate = () => {
    setRotation((prev) => prev + 90);
  };

  const handleError = (err: Error) => {
    setError(err.message);
  };

  return (
    <Card className={isFullscreen ? 'fixed inset-4 z-50' : ''}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>3D Model Viewer</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRotate}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Expand className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex flex-col items-center justify-center h-[500px] bg-muted rounded-lg">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Failed to load 3D model</p>
            <Button 
              variant="link" 
              className="mt-2"
              onClick={() => setError(null)}
            >
              Try again
            </Button>
          </div>
        ) : (
          <div style={{ transform: `rotate(${rotation}deg)` }}>
            <StlViewer
              style={style}
              url={url}
              modelColor="#1e88e5"
              backgroundColor="#ffffff"
              rotate={true}
              orbitControls={true}
              onError={handleError}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}