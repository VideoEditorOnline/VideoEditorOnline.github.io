import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Volume2, Music, Video, Scissors, Plus } from "lucide-react";
import type { VideoData, TextOverlay } from "@/pages/Index";

export interface Scene {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  color: string;
}

interface TimelineProps {
  videoData: VideoData;
  textOverlays: TextOverlay[];
  scenes?: Scene[];
  onSeek: (time: number) => void;
  onAddScene?: (scene: Scene) => void;
  onSplitScene?: (time: number) => void;
}

export const Timeline = ({
  videoData,
  textOverlays,
  scenes = [],
  onSeek,
  onAddScene,
  onSplitScene
}: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const millisecs = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millisecs.toString().padStart(2, '0')}`;
  };

  const handleAddScene = () => {
    if (onAddScene) {
      const newScene: Scene = {
        id: `scene-${Date.now()}`,
        name: `Scene ${scenes.length + 1}`,
        startTime: videoData.currentTime,
        endTime: Math.min(videoData.currentTime + 10, videoData.duration),
        color: `hsl(${(scenes.length * 137.5) % 360}, 70%, 50%)`
      };
      onAddScene(newScene);
    }
  };

  const handleSplitAtPlayhead = () => {
    if (onSplitScene) {
      onSplitScene(videoData.currentTime);
    }
  };

  const generateTimeMarkers = () => {
    if (videoData.duration === 0) return [];
    const intervals = Math.min(Math.ceil(videoData.duration / 10), 20);
    return Array.from({ length: intervals + 1 }, (_, i) => {
      const time = (videoData.duration * i) / intervals;
      return { time, label: formatTime(time) };
    });
  };

  const handleTimelineClick = (event: React.MouseEvent) => {
    if (!timelineRef.current || videoData.duration === 0) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * videoData.duration;

    onSeek(Math.max(0, Math.min(videoData.duration, newTime)));
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    handleTimelineClick(event);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    handleTimelineClick(event);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (videoData.duration === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-card rounded-lg border">
        <div className="text-center space-y-2">
          <Video className="w-8 h-8 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Upload a video to see professional timeline</p>
        </div>
      </div>
    );
  }

  const playheadPosition = (videoData.currentTime / videoData.duration) * 100;
  const timeMarkers = generateTimeMarkers();

  return (
    <div className="bg-card rounded-lg border p-4 space-y-4">
      {/* Timeline header with controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Video className="w-4 h-4" />
            Professional Timeline
          </h3>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddScene}
              data-testid="button-add-scene"
            >
              <Plus className="w-3 h-3 mr-1" />
              Scene
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSplitAtPlayhead}
              data-testid="button-split-scene"
            >
              <Scissors className="w-3 h-3 mr-1" />
              Split
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono bg-muted px-3 py-1 rounded">
          <span className="text-primary font-semibold">{formatTime(videoData.currentTime)}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{formatTime(videoData.duration)}</span>
        </div>
      </div>

      <Separator />

      {/* Time ruler */}
      <div className="relative h-6 bg-muted/30 rounded">
        <div className="absolute inset-0 flex">
          {timeMarkers.map((marker, i) => (
            <div
              key={i}
              className="flex-1 relative border-l border-muted-foreground/20 first:border-l-0"
            >
              <div className="absolute -top-1 left-0 text-[10px] text-muted-foreground font-mono transform -translate-x-1/2">
                {marker.label}
              </div>
              <div className="absolute top-0 left-0 w-px h-2 bg-muted-foreground/40" />
            </div>
          ))}
        </div>
      </div>

      {/* Main timeline tracks */}
      <div className="space-y-3">
        {/* Scene track */}
        {scenes.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-20 text-xs font-medium text-muted-foreground">SCENES</div>
              <div className="flex-1 h-8 relative border rounded" data-testid="track-scenes">
                {scenes.map(scene => {
                  const startPercentage = (scene.startTime / videoData.duration) * 100;
                  const widthPercentage = ((scene.endTime - scene.startTime) / videoData.duration) * 100;

                  return (
                    <div
                      key={scene.id}
                      className="absolute top-0 h-full rounded flex items-center px-2 text-xs font-medium text-white shadow-sm cursor-pointer hover:opacity-90"
                      style={{
                        left: `${startPercentage}%`,
                        width: `${widthPercentage}%`,
                        backgroundColor: scene.color,
                      }}
                      data-testid={`scene-${scene.id}`}
                    >
                      <span className="truncate">{scene.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Video track */}
        <div className="space-y-2" data-track="video">
          <div className="flex items-center gap-2">
            <div className="w-20 text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Video className="w-3 h-3" />
              VIDEO
            </div>
            <div
              ref={timelineRef}
              className="flex-1 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border rounded cursor-pointer relative hover:from-blue-500/30 hover:to-purple-500/30 transition-colors overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              data-testid="track-video"
            >
              <div className="absolute inset-0 flex items-center px-3 z-10">
                <span className="text-xs font-medium text-foreground truncate">
                  {videoData.file?.name || "Video Track"}
                </span>
              </div>

              {/* Waveform visualization placeholder */}
              <div className="absolute bottom-1 left-2 right-2 h-2 flex items-end gap-px">
                {Array.from({ length: 50 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-400/60 rounded-sm"
                    style={{ height: `${Math.random() * 100}%` }}
                  />
                ))}
              </div>

              {/* Track playhead indicator */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500/80 z-20"
                style={{ left: `${Math.min(playheadPosition, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Audio track */}
        <div className="space-y-2" data-track="audio">
          <div className="flex items-center gap-2">
            <div className="w-20 text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Volume2 className="w-3 h-3" />
              AUDIO
            </div>
            <div className="flex-1 h-10 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border rounded relative overflow-hidden" data-testid="track-audio">
              <div className="absolute inset-0 flex items-center px-3 z-10">
                <span className="text-xs font-medium text-foreground">
                  Audio Track
                </span>
              </div>

              {/* Audio waveform visualization */}
              <div className="absolute bottom-1 left-2 right-2 h-3 flex items-end gap-px">
                {Array.from({ length: 80 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-green-400/60 rounded-sm"
                    style={{ height: `${Math.random() * 100}%` }}
                  />
                ))}
              </div>

              {/* Track playhead indicator */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500/80 z-20"
                style={{ left: `${Math.min(playheadPosition, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Text overlays track */}
        {textOverlays.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-20 text-xs font-medium text-muted-foreground">TEXT</div>
              <div className="flex-1 h-8 border rounded relative bg-muted/10 overflow-hidden" data-testid="track-text">
                {textOverlays.map(overlay => {
                  const startPercentage = (overlay.startTime / videoData.duration) * 100;
                  const widthPercentage = ((overlay.endTime - overlay.startTime) / videoData.duration) * 100;

                  return (
                    <div
                      key={overlay.id}
                      className="absolute top-0 h-full bg-yellow-500/60 rounded-sm flex items-center px-2 text-[10px] font-medium text-yellow-900 cursor-pointer hover:bg-yellow-500/80 transition-colors z-10"
                      style={{
                        left: `${startPercentage}%`,
                        width: `${widthPercentage}%`,
                      }}
                      data-testid={`text-overlay-${overlay.id}`}
                    >
                      <span className="truncate">{overlay.text}</span>
                    </div>
                  );
                })}

                {/* Track playhead indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500/80 z-20"
                  style={{ left: `${Math.min(playheadPosition, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Effects track */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-20 text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Music className="w-3 h-3" />
              EFFECTS
            </div>
            <div className="flex-1 h-6 border rounded relative bg-muted/5 overflow-hidden" data-testid="track-effects">
              <div className="absolute inset-0 flex items-center px-2 z-10">
                <span className="text-xs text-muted-foreground">Drop effects here</span>
              </div>

              {/* Track playhead indicator */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500/80 z-20"
                style={{ left: `${Math.min(playheadPosition, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Playhead - positioned only within timeline tracks area */}
      <div
        className="absolute w-0.5 bg-red-500 pointer-events-none z-10 shadow-lg"
        style={{
          left: `calc(5rem + ${Math.min(playheadPosition, 100)}% * (100% - 5rem) / 100)`,
          top: '120px', // Start below the time ruler
          bottom: '16px' // End above the bottom padding
        }}
      >
        {/* Top handle */}
        <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-sm shadow-lg border border-white" />

        {/* Bottom handle */}
        <div className="absolute -bottom-1 -left-1.5 w-3 h-3 bg-red-500 rounded-sm shadow-lg border border-white" />
      </div>
    </div>
  );
};