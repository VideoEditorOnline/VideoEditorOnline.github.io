import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Heart,
  Star,
  Smile,
  Zap,
  Crown,
  Sun,
  Moon,
  Camera,
  Music,
  Gift,
  Trophy,
  Target,
  Flame,
  Sparkles,
  Plus
} from "lucide-react";

interface StickersAndSymbolsProps {
  onAddSticker: (content: string, type: 'sticker' | 'symbol') => void;
}

export const StickersAndSymbols = ({ onAddSticker }: StickersAndSymbolsProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Koleksi emoji dan stiker populer
  const stickerCategories = {
    emotions: {
      label: "Emotions",
      items: ["😀", "😂", "😍", "🤗", "😎", "🤔", "😭", "😡", "😱", "🤩", "🥰", "😘", "😉", "😊", "🙃", "😋"]
    },
    hearts: {
      label: "Hearts & Love", 
      items: ["❤️", "💕", "💖", "💝", "💘", "💗", "💓", "💞", "💌", "💯", "💋", "😍", "🥰", "😘", "💑", "👫"]
    },
    nature: {
      label: "Nature",
      items: ["🌟", "⭐", "🌙", "☀️", "🌈", "⚡", "🔥", "💨", "❄️", "🌊", "🌸", "🌺", "🌻", "🌹", "🍀", "🌿"]
    },
    objects: {
      label: "Objects",
      items: ["🎯", "🏆", "👑", "💎", "🎁", "🎉", "🎊", "🎈", "🎀", "🎭", "🎨", "🎪", "🎸", "🎤", "📸", "💡"]
    },
    symbols: {
      label: "Symbols",
      items: ["✨", "💫", "⭐", "🌟", "💥", "💢", "💦", "💨", "🔥", "⚡", "✅", "❌", "⚠️", "🔴", "🟢", "🔵"]
    },
    flags: {
      label: "Arrows & Flags",
      items: ["👆", "👇", "👈", "👉", "☝️", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👌", "🤌", "🤏", "✋", "🖐️"]
    }
  };

  // Simbol matematika dan khusus
  const symbolCategories = {
    math: {
      label: "Math & Numbers",
      items: ["±", "×", "÷", "=", "≠", "≈", "≤", "≥", "∞", "√", "∑", "π", "Ω", "α", "β", "γ"]
    },
    arrows: {
      label: "Arrows",
      items: ["→", "←", "↑", "↓", "↗", "↖", "↘", "↙", "⤴", "⤵", "↩", "↪", "⬅", "➡", "⬆", "⬇"]
    },
    shapes: {
      label: "Shapes",
      items: ["●", "○", "◆", "◇", "■", "□", "▲", "△", "▼", "▽", "★", "☆", "♠", "♣", "♥", "♦"]
    },
    special: {
      label: "Special Characters",
      items: ["©", "®", "™", "§", "¶", "†", "‡", "•", "‰", "′", "″", "‴", "※", "‼", "⁇", "⁈"]
    },
    currency: {
      label: "Currency",
      items: ["$", "€", "£", "¥", "₹", "₽", "₩", "₦", "₡", "₨", "₪", "₫", "€", "₢", "₵", "₶"]
    },
    punctuation: {
      label: "Punctuation",
      items: ['"', '"', "'", "'", "«", "»", "‹", "›", "…", "–", "—", "¡", "¿", "§", "¶", "†"]
    }
  };

  const filterItems = (items: string[], query: string) => {
    if (!query) return items;
    return items; // For emojis/symbols, visual filtering isn't practical
  };

  const handleAddItem = (content: string, type: 'sticker' | 'symbol') => {
    onAddSticker(content, type);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Stickers & Symbols
        </h3>
        <p className="text-xs text-muted-foreground">
          Add emojis, stickers and special symbols to your video
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search stickers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-8 text-xs"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="stickers" className="space-y-3">
        <TabsList className="grid w-full grid-cols-2 h-8">
          <TabsTrigger value="stickers" className="text-xs" data-testid="tab-stickers">
            <Smile className="w-3 h-3 mr-1" />
            Stickers
          </TabsTrigger>
          <TabsTrigger value="symbols" className="text-xs" data-testid="tab-symbols">
            <Star className="w-3 h-3 mr-1" />
            Symbols
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stickers" className="space-y-3">
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted space-y-3">
            {Object.entries(stickerCategories).map(([categoryId, category]) => (
              <div key={categoryId}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                    {category.label}
                  </Badge>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {filterItems(category.items, searchQuery).map((item, index) => (
                    <Button
                      key={`${categoryId}-${index}`}
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 text-xl hover:bg-primary/10 hover:scale-110 transition-all"
                      onClick={() => handleAddItem(item, 'sticker')}
                      data-testid={`sticker-${categoryId}-${index}`}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="symbols" className="space-y-3">
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted space-y-3">
            {Object.entries(symbolCategories).map(([categoryId, category]) => (
              <div key={categoryId}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                    {category.label}
                  </Badge>
                </div>
                <div className="grid grid-cols-8 gap-1">
                  {filterItems(category.items, searchQuery).map((item, index) => (
                    <Button
                      key={`${categoryId}-${index}`}
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-sm font-mono hover:bg-primary/10 hover:scale-110 transition-all border border-muted/50 hover:border-primary/30"
                      onClick={() => handleAddItem(item, 'symbol')}
                      data-testid={`symbol-${categoryId}-${index}`}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="p-3 bg-muted/30">
        <div className="text-xs text-muted-foreground mb-2 font-medium">Quick Add Popular:</div>
        <div className="flex flex-wrap gap-1">
          {["🔥", "✨", "💯", "❤️", "👍", "🎉", "→", "★"].map((item, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleAddItem(item, index < 6 ? 'sticker' : 'symbol')}
              data-testid={`quick-${index}`}
            >
              {item}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};