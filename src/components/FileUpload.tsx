import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Video } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onUpload: (file: File) => void;
}

export const FileUpload = ({ onUpload }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a video file
    if (!file.type.startsWith('video/')) {
      toast.error("Please select a valid video file");
      return;
    }

    // Check file size (max 100MB for demo)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100MB");
      return;
    }

    onUpload(file);
    toast.success("Video uploaded successfully!");
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error("Please select a valid video file");
        return;
      }
      onUpload(file);
      toast.success("Video uploaded successfully!");
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="p-12 text-center max-w-md w-full shadow-editor">
        <div 
          className="border-2 border-dashed border-border rounded-lg p-8 transition-colors hover:border-primary/50 cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <Video className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload Your Video</h3>
              <p className="text-muted-foreground text-sm">
                Drag and drop a video file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports MP4, WebM, AVI • Max 100MB
              </p>
            </div>
            
            <Button variant="gradient" className="gap-2">
              <Upload className="w-4 h-4" />
              Select Video
            </Button>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </Card>
    </div>
  );
};