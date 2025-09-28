import { useState } from "react";
import { VideoPreview } from "@/components/VideoPreview";
import { Timeline, Scene } from "@/components/Timeline";
import { Sidebar } from "@/components/Sidebar";
import { Controls } from "@/components/Controls";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Download } from "lucide-react";
import { toast } from "sonner";

export interface VideoData {
  file: File | null;
  url: string | null;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  startTime: number;
  endTime: number;
}

export interface StickerOverlay {
  id: string;
  type: 'sticker' | 'symbol';
  content: string; // emoji or symbol character
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  startTime: number;
  endTime: number;
}

const Index = () => {
  const [videoData, setVideoData] = useState<VideoData>({
    file: null,
    url: null,
    duration: 0,
    currentTime: 0,
    isPlaying: false,
  });

  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [stickerOverlays, setStickerOverlays] = useState<StickerOverlay[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const handleVideoUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoData(prev => ({
      ...prev,
      file,
      url,
    }));
  };

  const handleTimeUpdate = (currentTime: number) => {
    setVideoData(prev => ({
      ...prev,
      currentTime,
    }));
  };

  const handleDurationChange = (duration: number) => {
    setVideoData(prev => ({
      ...prev,
      duration,
    }));
  };

  const handlePlayPause = () => {
    setVideoData(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  };

  const handleSeek = (time: number) => {
    setVideoData(prev => ({
      ...prev,
      currentTime: time,
    }));
  };

  const addTextOverlay = (text: string) => {
    const newOverlay: TextOverlay = {
      id: `overlay-${Date.now()}`,
      text,
      x: 50,
      y: 50,
      fontSize: 24,
      color: "#ffffff",
      startTime: videoData.currentTime,
      endTime: videoData.currentTime + 5,
    };
    setTextOverlays(prev => [...prev, newOverlay]);
    toast.success("Text overlay added!");
  };

  const addStickerOverlay = (content: string, type: 'sticker' | 'symbol' = 'sticker') => {
    const newOverlay: StickerOverlay = {
      id: `sticker-${Date.now()}`,
      type,
      content,
      x: Math.random() * 200 + 100, // Random position
      y: Math.random() * 150 + 75,
      size: type === 'symbol' ? 32 : 48,
      rotation: 0,
      opacity: 1,
      startTime: videoData.currentTime,
      endTime: videoData.currentTime + 8,
    };
    setStickerOverlays(prev => [...prev, newOverlay]);
    toast.success(`${type === 'sticker' ? 'Sticker' : 'Symbol'} added!`);
  };

  const updateTextOverlay = (id: string, updates: Partial<TextOverlay>) => {
    setTextOverlays(prev => 
      prev.map(overlay => 
        overlay.id === id ? { ...overlay, ...updates } : overlay
      )
    );
  };

  const removeTextOverlay = (id: string) => {
    setTextOverlays(prev => prev.filter(overlay => overlay.id !== id));
  };

  const updateStickerOverlay = (id: string, updates: Partial<StickerOverlay>) => {
    setStickerOverlays(prev => 
      prev.map(overlay => 
        overlay.id === id ? { ...overlay, ...updates } : overlay
      )
    );
  };

  const removeStickerOverlay = (id: string) => {
    setStickerOverlays(prev => prev.filter(overlay => overlay.id !== id));
    toast.success("Sticker removed!");
  };

  const addScene = (scene: Scene) => {
    setScenes(prev => [...prev, scene]);
    toast.success(`Scene "${scene.name}" added`);
  };

  const splitScene = (time: number) => {
    const activeScene = scenes.find(scene => 
      time >= scene.startTime && time <= scene.endTime
    );

    if (activeScene) {
      const newScene: Scene = {
        id: `scene-${Date.now()}`,
        name: `${activeScene.name} (Split)`,
        startTime: time,
        endTime: activeScene.endTime,
        color: activeScene.color
      };

      setScenes(prev => prev.map(scene => 
        scene.id === activeScene.id 
          ? { ...scene, endTime: time }
          : scene
      ).concat(newScene));

      toast.success('Scene split successfully');
    } else {
      toast.error('No scene to split at current position');
    }
  };

  const handleStockVideoSelect = (videoUrl: string, title: string) => {
    console.log("Loading video:", title, "from URL:", videoUrl);

    // Create a temporary video element to validate the URL
    const tempVideo = document.createElement('video');
    tempVideo.crossOrigin = "anonymous";

    tempVideo.onloadedmetadata = () => {
      console.log("Video metadata loaded successfully");
      setVideoData(prev => ({
        ...prev,
        file: new File([], `${title}.mp4`, { type: 'video/mp4' }),
        url: videoUrl,
        currentTime: 0,
        duration: tempVideo.duration,
        isPlaying: false
      }));
      toast.success(`"${title}" berhasil dimuat!`);
    };

    tempVideo.onerror = (error) => {
      console.log("Video load error:", error);
      toast.error(`Gagal memuat "${title}". Mencoba video alternatif...`);

      // Fallback to a different working video
      const fallbackUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      setVideoData(prev => ({
        ...prev,
        file: new File([], `${title}.mp4`, { type: 'video/mp4' }),
        url: fallbackUrl,
        currentTime: 0,
        duration: 0,
        isPlaying: false
      }));
      toast.success(`Video alternatif dimuat untuk "${title}"`);
    };

    tempVideo.src = videoUrl;
  };

  const handleExport = () => {
    toast.info("Export feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      {/* Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6">
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
          Video Editor
        </h1>

        {/* Export Button - Professional positioning */}
        <Button
          variant="default"
          onClick={handleExport}
          data-testid="button-export"
          className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar 
          onAddText={addTextOverlay}
          onAddSticker={addStickerOverlay}
          textOverlays={textOverlays}
          stickerOverlays={stickerOverlays}
          onUpdateOverlay={updateTextOverlay}
          onUpdateStickerOverlay={updateStickerOverlay}
          onRemoveOverlay={removeTextOverlay}
          onRemoveStickerOverlay={removeStickerOverlay}
          onSelectStockVideo={handleStockVideoSelect}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-muted/20">
          {/* Video Preview Area - Fixed spacing to not overlap controls */}
          <div className="flex-1 min-h-0 p-6 pb-4">
            {videoData.url ? (
              <VideoPreview 
                videoData={videoData}
                textOverlays={textOverlays}
                stickerOverlays={stickerOverlays}
                onTimeUpdate={handleTimeUpdate}
                onDurationChange={handleDurationChange}
                onSeek={handleSeek}
              />
            ) : (
              <FileUpload onUpload={handleVideoUpload} />
            )}
          </div>

          {/* Controls Section - Fixed positioning */}
          <div className="shrink-0 px-6 pb-2 bg-background border-t border-border">
            <Controls 
              videoData={videoData}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
              playbackSpeed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
            />
          </div>

          {/* Professional Timeline - Fixed at bottom */}
          <div className="shrink-0 h-64 px-6 bg-card border-t border-border">
            <Timeline 
              videoData={videoData}
              textOverlays={textOverlays}
              scenes={scenes}
              onSeek={handleSeek}
              onAddScene={addScene}
              onSplitScene={splitScene}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;