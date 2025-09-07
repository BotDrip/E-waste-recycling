import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export function AIDetectionPage() {
  const { toast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [isDetecting, setIsDetecting] = React.useState(false);
  const [detectionResult, setDetectionResult] = React.useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDetectionResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select an image file to detect.',
        variant: 'destructive',
      });
      return;
    }

    setIsDetecting(true);
    setDetectionResult(null);
    const formData = new FormData();
    formData.append('ewasteImage', file);

    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to detect e-waste');
      }

      const result = await response.json();
      setDetectionResult(result.message);
      toast({
        title: 'Detection Complete!',
        description: result.message,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'There was a problem detecting the e-waste.',
        variant: 'destructive',
      });
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-3xl font-bold mb-4 text-center">AI E-Waste Detection</h2>
      <p className="text-muted-foreground mb-6 text-center">
        Upload an image of an electronic item to identify it. (This is a simulation)
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ewaste-image">E-Waste Image</Label>
              <Input id="ewaste-image" type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {preview && (
              <div className="mt-4">
                <img src={preview} alt="E-waste preview" className="max-h-60 rounded-md mx-auto" />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isDetecting || !file}>
              {isDetecting ? 'Detecting...' : 'Detect E-Waste'}
            </Button>

            {detectionResult && (
              <div className="mt-6 p-4 bg-secondary rounded-md text-center">
                <p className="font-semibold text-lg">{detectionResult}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
