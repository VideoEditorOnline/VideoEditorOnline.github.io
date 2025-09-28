import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Download,
  Scissors,
  FastForward,
  Rewind,
  Square,
  RotateCcw,
  Maximize,
  Settings,
  Zap,
  Film
} from "lucide-react";
import type { VideoData } from "@/pages/Index";
import { toast } from "sonner";

interface ControlsProps {
  videoData: VideoData;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  playbackSpeed?: number;
  onSpeedChange?: (speed: number) => void;
}

export const Controls = ({ 
  videoData, 
  onPlayPause, 
  onSeek, 
  playbackSpeed = 1, 
  onSpeedChange 
}: ControlsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  const handleSpeedChange = (speed: number) => {
    if (onSpeedChange) {
      onSpeedChange(speed);
    }
  };

  const handleStop = () => {
    onSeek(0);
  };

  const handleRestart = () => {
    onSeek(0);
  };

  const getPlaybackSpeedColor = (speed: number) => {
    if (speed < 1) return 'bg-blue-500';
    if (speed > 1) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const handleSkipBack = () => {
    const newTime = Math.max(0, videoData.currentTime - 5);
    onSeek(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(videoData.duration, videoData.currentTime + 5);
    onSeek(newTime);
  };

  const handleFastRewind = () => {
    const newTime = Math.max(0, videoData.currentTime - 30);
    onSeek(newTime);
  };

  const handleFastForward = () => {
    const newTime = Math.min(videoData.duration, videoData.currentTime + 30);
    onSeek(newTime);
  };

  const handleTrim = () => {
    toast.info("Professional trim feature coming soon!", {
      description: "Advanced cutting tools with frame precision"
    });
  };

  if (!videoData.url) return (
    <div className="bg-card rounded-lg border p-4">
      <div className="text-center text-muted-foreground">
        <Film className="w-6 h-6 mx-auto mb-2" />
        <p className="text-sm">Upload a video to access professional controls</p>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-lg border shadow-lg">
      {/* Main control bar */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-6">
          {/* Primary Playback Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRestart}
              data-testid="button-restart"
              className="hover:bg-muted"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFastRewind}
              data-testid="button-rewind"
              className="hover:bg-muted"
            >
              <Rewind className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipBack}
              data-testid="button-skip-back"
              className="hover:bg-muted"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              variant={videoData.isPlaying ? "default" : "default"}
              size="lg"
              onClick={onPlayPause}
              data-testid="button-play-pause"
              className="mx-2 h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
            >
              {videoData.isPlaying ? (
                <Pause className="w-6 h-6 text-primary-foreground" />
              ) : (
                <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStop}
              data-testid="button-stop"
              className="hover:bg-muted"
            >
              <Square className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipForward}
              data-testid="button-skip-forward"
              className="hover:bg-muted"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFastForward}
              data-testid="button-fast-forward"
              className="hover:bg-muted"
            >
              <FastForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Time Display */}
          <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-lg">
            <div className="text-sm font-mono font-semibold text-primary" data-testid="time-current">
              {formatTime(videoData.currentTime)}
            </div>
            <div className="text-muted-foreground">/</div>
            <div className="text-sm font-mono text-muted-foreground" data-testid="time-duration">
              {formatTime(videoData.duration)}
            </div>
            <Separator orientation="vertical" className="h-4" />
            <Badge 
              className={`${getPlaybackSpeedColor(playbackSpeed)} text-white text-xs font-semibold`}
              data-testid="speed-indicator"
            >
              {playbackSpeed}x
            </Badge>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center gap-4">
            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={[100]}
                max={100}
                step={5}
                className="w-24"
                data-testid="volume-slider"
              />
              <span className="text-xs text-muted-foreground w-8">100%</span>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Editing Tools */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTrim}
                data-testid="button-trim"
                className="gap-2 hover:bg-muted"
              >
                <Scissors className="w-4 h-4" />
                Trim
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                data-testid="button-settings"
                className="hover:bg-muted"
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                data-testid="button-fullscreen"
                className="hover:bg-muted"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Speed controls */}
      <Separator />
      <div className="p-3 bg-muted/20">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground mr-2">Playback Speed:</span>
          {playbackSpeeds.map(speed => (
            <Button
              key={speed}
              variant={playbackSpeed === speed ? "default" : "ghost"}
              size="sm"
              onClick={() => handleSpeedChange(speed)}
              data-testid={`speed-${speed}`}
              className={`text-xs h-8 w-12 ${
                playbackSpeed === speed 
                  ? getPlaybackSpeedColor(speed) + ' text-white' 
                  : 'hover:bg-muted'
              }`}
            >
              {speed}x
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};