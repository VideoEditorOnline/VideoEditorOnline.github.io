import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import type { VideoData, TextOverlay, StickerOverlay } from "@/pages/Index";

interface VideoPreviewProps {
  videoData: VideoData;
  textOverlays: TextOverlay[];
  stickerOverlays?: StickerOverlay[];
  onTimeUpdate: (currentTime: number) => void;
  onDurationChange: (duration: number) => void;
  onSeek: (time: number) => void;
}

export const VideoPreview = ({
  videoData,
  textOverlays,
  stickerOverlays = [],
  onTimeUpdate,
  onDurationChange,
  onSeek
}: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      console.log("Video metadata loaded - Duration:", video.duration);
      onDurationChange(video.duration);
      setDimensions({
        width: video.videoWidth,
        height: video.videoHeight
      });
    };

    const handleTimeUpdate = () => {
      onTimeUpdate(video.currentTime);
    };

    const handleError = (error: any) => {
      console.error("Video playback error:", error);
    };

    const handleLoadStart = () => {
      console.log("Video load started");
    };

    const handleCanPlay = () => {
      console.log("Video can start playing");
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [onTimeUpdate, onDurationChange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (videoData.isPlaying) {
      video.play();
    } else {
      video.pause();
    }
  }, [videoData.isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - videoData.currentTime) > 0.1) {
      video.currentTime = videoData.currentTime;
    }
  }, [videoData.currentTime]);

  // Render text overlays on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render active text overlays
      const currentTime = videoData.currentTime;
      const activeOverlays = textOverlays.filter(
        overlay => currentTime >= overlay.startTime && currentTime <= overlay.endTime
      );

      activeOverlays.forEach(overlay => {
        ctx.font = `${overlay.fontSize}px Arial`;
        ctx.fillStyle = overlay.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        // Add text stroke for better readability
        ctx.strokeText(overlay.text, overlay.x, overlay.y);
        ctx.fillText(overlay.text, overlay.x, overlay.y);
      });

      requestAnimationFrame(render);
    };

    render();
  }, [videoData.currentTime, textOverlays]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    
    onSeek(videoData.currentTime);
  };

  if (!videoData.url) return (
    <div className="flex items-center justify-center h-full p-6">
      <Card className="bg-muted/30 border-2 border-dashed border-muted-foreground/30 rounded-2xl" 
            style={{ 
              width: 'min(90vw, 800px)', 
              height: 'min(50.625vw, 450px)', 
              aspectRatio: '16/9',
              maxWidth: '800px',
              maxHeight: '450px'
            }}>
        <div className="text-center space-y-6 h-full flex flex-col justify-center p-8">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-3 text-foreground">Professional Video Editor</h3>
            <p className="text-muted-foreground text-base mb-2">Upload a video or select from library to start editing</p>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground/80 bg-muted/50 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Supported: MP4, WebM, AVI • Max 100MB
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="flex items-center justify-between gap-6 h-full p-6">
      <Card className="relative bg-black/98 border border-border/50 shadow-2xl rounded-2xl overflow-hidden">
        <div 
          className="relative bg-black rounded-xl overflow-hidden"
          style={{ 
            width: 'min(90vw, 800px)', 
            height: 'min(50.625vw, 450px)', 
            aspectRatio: '16/9',
            maxWidth: '800px',
            maxHeight: '450px'
          }}
        >
          {/* Video container with fixed aspect ratio */}
          <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              src={videoData.url}
              className="w-full h-full object-contain"
              onLoadedMetadata={() => {
                const video = videoRef.current;
                if (video && canvasRef.current) {
                  // Set canvas dimensions to match video container, not source
                  const container = video.parentElement;
                  if (container) {
                    const rect = container.getBoundingClientRect();
                    canvasRef.current.width = rect.width;
                    canvasRef.current.height = rect.height;
                  }
                }
              }}
              data-testid="video-player"
              style={{ 
                width: '100%', 
                height: '100%',
                objectFit: 'contain',
                display: 'block'
              }}
            />
            
            {/* Text overlay canvas - perfectly aligned with video */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-auto cursor-crosshair"
              onClick={handleCanvasClick}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block'
              }}
              data-testid="text-overlay-canvas"
            />
            
            {/* Professional video overlay UI */}
            <div className="absolute top-3 left-3 bg-black/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-lg"></div>
                <span className="font-semibold">LIVE PREVIEW</span>
              </div>
            </div>
            
            {/* Video specs indicator */}
            <div className="absolute top-3 right-3 bg-black/90 text-white px-3 py-1.5 rounded-lg text-xs font-mono backdrop-blur-md border border-white/10">
              <div className="text-center">
                <div className="text-green-400 font-bold">{dimensions.width}×{dimensions.height}</div>
                <div className="text-gray-400 text-[10px]">{videoData.isPlaying ? 'PLAYING' : 'PAUSED'}</div>
              </div>
            </div>
            
            {/* Professional frame border */}
            <div className="absolute inset-0 border-2 border-white/10 rounded-xl pointer-events-none"></div>
          </div>
        </div>
      </Card>
    </div>
  );
};