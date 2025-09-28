import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Type, 
  Palette, 
  Layers, 
  Music, 
  Sparkles,
  Trash2,
  Plus,
  Video,
  Library
} from "lucide-react";
import type { TextOverlay, StickerOverlay } from "@/pages/Index";
import { StockLibrary } from "@/components/StockLibrary";
import { toast } from "sonner";

interface SidebarProps {
  onAddText: (text: string) => void;
  onAddSticker?: (content: string, type?: 'sticker' | 'symbol') => void;
  textOverlays: TextOverlay[];
  stickerOverlays?: StickerOverlay[];
  onUpdateOverlay: (id: string, updates: Partial<TextOverlay>) => void;
  onUpdateStickerOverlay?: (id: string, updates: Partial<StickerOverlay>) => void;
  onRemoveOverlay: (id: string) => void;
  onRemoveStickerOverlay?: (id: string) => void;
  onSelectStockVideo: (videoUrl: string, title: string) => void;
}

export const Sidebar = ({ 
  onAddText,
  onAddSticker, 
  textOverlays,
  stickerOverlays = [],
  onUpdateOverlay,
  onUpdateStickerOverlay, 
  onRemoveOverlay,
  onRemoveStickerOverlay,
  onSelectStockVideo
}: SidebarProps) => {
  const [newText, setNewText] = useState("");
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);

  const handleAddText = () => {
    if (!newText.trim()) {
      toast.error("Please enter some text");
      return;
    }
    onAddText(newText.trim());
    setNewText("");
    toast.success("Text overlay added!");
  };

  const selectedOverlayData = textOverlays.find(o => o.id === selectedOverlay);

  return (
    <div className="w-80 editor-sidebar p-4 space-y-6 overflow-y-auto">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Editor Tools</h2>
        <p className="text-sm text-muted-foreground">
          Add content, effects, and customize your video
        </p>
      </div>

      <Separator />

      {/* Tabs for different sections */}
      <Tabs defaultValue="library" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="library" className="text-xs">
            <Library className="w-3 h-3 mr-1" />
            Library
          </TabsTrigger>
          <TabsTrigger value="text" className="text-xs">
            <Type className="w-3 h-3 mr-1" />
            Text
          </TabsTrigger>
        </TabsList>

        {/* Stock Library Tab */}
        <TabsContent value="library" className="space-y-4 mt-4">
          <StockLibrary onSelectVideo={onSelectStockVideo} />
        </TabsContent>

        {/* Text Tools Tab */}
        <TabsContent value="text" className="space-y-4 mt-4">
          {/* Add Text Section */}
          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" />
              <h3 className="font-medium">Add Text</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="text-input">Text Content</Label>
                <Input
                  id="text-input"
                  placeholder="Enter text to overlay..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
                />
              </div>
              
              <Button 
                onClick={handleAddText} 
                variant="gradient"
                className="w-full"
                disabled={!newText.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Text Overlay
              </Button>
            </div>
          </Card>

          {/* Text Overlays List */}
          {textOverlays.length > 0 && (
            <Card className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h3 className="font-medium">Text Overlays</h3>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {textOverlays.map(overlay => (
                  <div 
                    key={overlay.id}
                    className={`p-2 rounded-lg border cursor-pointer transition-fast ${
                      selectedOverlay === overlay.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedOverlay(
                      selectedOverlay === overlay.id ? null : overlay.id
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate flex-1">
                        {overlay.text}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveOverlay(overlay.id);
                          if (selectedOverlay === overlay.id) {
                            setSelectedOverlay(null);
                          }
                          toast.success("Text overlay removed");
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {overlay.startTime.toFixed(1)}s - {overlay.endTime.toFixed(1)}s
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Text Properties */}
          {selectedOverlayData && (
            <Card className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                <h3 className="font-medium">Text Properties</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label>Text Content</Label>
                  <Input
                    value={selectedOverlayData.text}
                    onChange={(e) => onUpdateOverlay(selectedOverlay!, { text: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Font Size</Label>
                  <Input
                    type="number"
                    min="12"
                    max="72"
                    value={selectedOverlayData.fontSize}
                    onChange={(e) => onUpdateOverlay(selectedOverlay!, { 
                      fontSize: parseInt(e.target.value) || 24 
                    })}
                  />
                </div>
                
                <div>
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={selectedOverlayData.color}
                    onChange={(e) => onUpdateOverlay(selectedOverlay!, { color: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Start Time (s)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={selectedOverlayData.startTime}
                      onChange={(e) => onUpdateOverlay(selectedOverlay!, { 
                        startTime: parseFloat(e.target.value) || 0 
                      })}
                    />
                  </div>
                  <div>
                    <Label>End Time (s)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={selectedOverlayData.endTime}
                      onChange={(e) => onUpdateOverlay(selectedOverlay!, { 
                        endTime: parseFloat(e.target.value) || 5 
                      })}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Coming Soon Features */}
      <Card className="p-4 space-y-3 opacity-60">
        <h3 className="font-medium text-sm">Coming Soon</h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" disabled>
            <Music className="w-4 h-4 mr-2" />
            Add Audio
          </Button>
          <Button variant="ghost" className="w-full justify-start" disabled>
            <Sparkles className="w-4 h-4 mr-2" />
            Effects & Filters
          </Button>
        </div>
      </Card>
    </div>
  );
};