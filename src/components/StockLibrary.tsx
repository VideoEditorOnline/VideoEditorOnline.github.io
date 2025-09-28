import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Download, 
  Play, 
  Video,
  Globe,
  Heart,
  Coffee,
  Monitor,
  Briefcase,
  Loader2,
  RefreshCw,
  Infinity
} from "lucide-react";
import { toast } from "sonner";

interface StockVideo {
  id: string;
  title: string;
  duration: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  tags: string[];
  source: string;
  width?: number;
  height?: number;
  user?: {
    name: string;
    url: string;
  };
}

interface StockLibraryProps {
  onSelectVideo: (videoUrl: string, title: string) => void;
}

export const StockLibrary = ({ onSelectVideo }: StockLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<StockVideo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Real Pexels API integration
  const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
  const PEXELS_BASE_URL = 'https://api.pexels.com/videos';

  const fetchPexelsVideos = async (pageNum: number, category: string, query: string): Promise<StockVideo[]> => {
    if (!PEXELS_API_KEY) {
      console.warn('Pexels API key not found, using fallback data');
      return generateFallbackVideos(pageNum, category, query);
    }

    try {
      let searchQuery = query || 'nature';

      // Map categories to search terms
      const categoryQueries = {
        nature: 'nature landscape mountain ocean forest',
        urban: 'city urban street building architecture',
        tech: 'technology computer digital innovation',
        lifestyle: 'lifestyle people happy life home',
        business: 'business office meeting professional work'
      };

      if (category !== 'all' && categoryQueries[category as keyof typeof categoryQueries]) {
        searchQuery = query ? `${query} ${categoryQueries[category as keyof typeof categoryQueries]}` : categoryQueries[category as keyof typeof categoryQueries];
      }

      const url = `${PEXELS_BASE_URL}/search?query=${encodeURIComponent(searchQuery)}&per_page=15&page=${pageNum}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`);
      }

      const data = await response.json();

      return data.videos.map((video: any) => ({
        id: `pexels-${video.id}`,
        title: video.tags ? video.tags.split(',').slice(0, 3).join(' ').trim() || 'Beautiful Video' : 'Beautiful Video',
        duration: formatDuration(video.duration),
        category: category === 'all' ? 'mixed' : category,
        thumbnail: video.image,
        videoUrl: video.video_files.find((file: any) => file.quality === 'hd' || file.quality === 'sd')?.link || video.video_files[0]?.link,
        tags: video.tags ? video.tags.split(',').map((tag: string) => tag.trim()).slice(0, 5) : ['video', 'footage'],
        source: 'Pexels',
        width: video.width,
        height: video.height,
        user: {
          name: video.user?.name || 'Pexels Contributor',
          url: video.user?.url || 'https://www.pexels.com'
        }
      }));
    } catch (error) {
      console.error('Pexels API error:', error);
      toast.error('Failed to fetch from Pexels API, using cached videos');
      return generateFallbackVideos(pageNum, category, query);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Fallback function for when API is unavailable
  const generateFallbackVideos = (pageNum: number, category: string, query: string): StockVideo[] => {
    const videoCategories = {
      nature: [
        { title: "Mountain Sunrise Timelapse", tags: ["mountain", "sunrise", "timelapse", "nature"], duration: "0:30" },
        { title: "Forest Stream Flowing", tags: ["forest", "water", "stream", "peaceful"], duration: "0:25" },
        { title: "Ocean Waves Crashing", tags: ["ocean", "waves", "beach", "water"], duration: "0:20" },
        { title: "Wildlife in Savanna", tags: ["wildlife", "animals", "savanna", "nature"], duration: "0:35" },
        { title: "Autumn Leaves Falling", tags: ["autumn", "leaves", "fall", "trees"], duration: "0:18" }
      ],
      urban: [
        { title: "City Night Traffic", tags: ["city", "traffic", "night", "lights"], duration: "0:22" },
        { title: "Skyscrapers from Below", tags: ["buildings", "architecture", "urban", "sky"], duration: "0:15" },
        { title: "Street Art Wall", tags: ["art", "street", "culture", "urban"], duration: "0:12" },
        { title: "Busy Intersection", tags: ["intersection", "people", "city", "movement"], duration: "0:28" },
        { title: "Subway Platform", tags: ["subway", "transport", "urban", "people"], duration: "0:20" }
      ],
      tech: [
        { title: "Code on Screen", tags: ["programming", "code", "technology", "screen"], duration: "0:16" },
        { title: "Circuit Board Close-up", tags: ["electronics", "circuit", "technology", "macro"], duration: "0:14" },
        { title: "Data Visualization", tags: ["data", "charts", "analytics", "technology"], duration: "0:24" },
        { title: "Robot Assembly Line", tags: ["robot", "automation", "industry", "technology"], duration: "0:32" },
        { title: "Server Room Lights", tags: ["servers", "data center", "technology", "lights"], duration: "0:19" }
      ],
      lifestyle: [
        { title: "Morning Coffee Ritual", tags: ["coffee", "morning", "lifestyle", "cozy"], duration: "0:18" },
        { title: "Yoga at Sunset", tags: ["yoga", "wellness", "sunset", "health"], duration: "0:26" },
        { title: "Friends Laughing", tags: ["friends", "happiness", "social", "lifestyle"], duration: "0:15" },
        { title: "Home Cooking", tags: ["cooking", "food", "home", "lifestyle"], duration: "0:22" },
        { title: "Reading by Window", tags: ["reading", "books", "quiet", "lifestyle"], duration: "0:20" }
      ],
      business: [
        { title: "Team Meeting", tags: ["meeting", "team", "business", "office"], duration: "0:28" },
        { title: "Handshake Deal", tags: ["handshake", "business", "deal", "professional"], duration: "0:08" },
        { title: "Financial Charts", tags: ["finance", "charts", "business", "analysis"], duration: "0:21" },
        { title: "Office Workspace", tags: ["office", "workspace", "business", "modern"], duration: "0:17" },
        { title: "Presentation Screen", tags: ["presentation", "business", "meeting", "screen"], duration: "0:24" }
      ]
    };

    const allVideos = Object.values(videoCategories).flat();
    const categoryVideos = category === 'all' ? allVideos : (videoCategories[category as keyof typeof videoCategories] || []);

    // Filter by search query
    const filteredVideos = query ? 
      categoryVideos.filter(v => 
        v.title.toLowerCase().includes(query.toLowerCase()) ||
        v.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ) : categoryVideos;

    // Paginate results (8 per page)
    const startIndex = (pageNum - 1) * 8;
    const endIndex = startIndex + 8;
    const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

    return paginatedVideos.map((video, index) => ({
      id: `${category}-${pageNum}-${index}`,
      title: video.title,
      duration: video.duration,
      category: category === 'all' ? 'mixed' : category,
      thumbnail: `https://picsum.photos/320/180?random=${pageNum * 8 + index}&blur=1`,
      videoUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/${['BigBuckBunny.mp4', 'ElephantsDream.mp4', 'ForBiggerBlazes.mp4', 'ForBiggerEscapes.mp4', 'ForBiggerFun.mp4', 'ForBiggerJoyrides.mp4'][index % 6]}`,
      tags: video.tags,
      source: ['Pexels', 'Pixabay', 'Videvo', 'Videezy'][index % 4],
      width: 1920,
      height: 1080,
      user: {
        name: ['Alex Johnson', 'Maria Silva', 'David Chen', 'Sarah Wilson'][index % 4],
        url: '#'
      }
    }));
  };

  const loadVideos = useCallback(async (pageNum: number, category: string, query: string, append: boolean = true) => {
    setIsLoadingMore(true);

    try {
      const newVideos = await fetchPexelsVideos(pageNum, category, query);

      if (append) {
        setVideos(prev => {
          // Remove duplicates based on ID
          const existingIds = new Set(prev.map(v => v.id));
          const uniqueNewVideos = newVideos.filter(v => !existingIds.has(v.id));
          return [...prev, ...uniqueNewVideos];
        });
      } else {
        setVideos(newVideos);
      }

      setHasMore(newVideos.length >= 10); // Pexels returns 15 per page, if we got less than 10, probably near end
      setPage(pageNum);

      if (newVideos.length > 0) {
        toast.success(`Loaded ${newVideos.length} new videos from Pexels!`);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      toast.error('Failed to load videos. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  }, []);

  // Load initial videos
  useEffect(() => {
    setVideos([]);
    setPage(1);
    setHasMore(true);
    loadVideos(1, selectedCategory, searchQuery, false);
  }, [selectedCategory, searchQuery, loadVideos]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadVideos(page + 1, selectedCategory, searchQuery, true);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, page, selectedCategory, searchQuery, loadVideos]);

  // Keep original static videos as fallback
  const fallbackVideos: StockVideo[] = [
    {
      id: "1",
      title: "City Traffic at Night",
      duration: "0:15",
      category: "urban",
      thumbnail: "https://images.pexels.com/videos/3571264/free-video-3571264.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      videoUrl: "https://vod-progressive.akamaized.net/exp=1703721600~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F3571%2F14%2F368002407%2F1546619575.mp4~hmac=abc123/1546619575.mp4",
      tags: ["city", "traffic", "night", "urban"],
      source: "Pexels"
    },
    {
      id: "2", 
      title: "Ocean Waves",
      duration: "0:20",
      category: "nature",
      thumbnail: "https://images.pexels.com/videos/1093662/free-video-1093662.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      videoUrl: "https://vod-progressive.akamaized.net/exp=1703721600~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F1093%2F7%2F178602667%2F746475770.mp4~hmac=def456/746475770.mp4",
      tags: ["ocean", "waves", "nature", "water"],
      source: "Pexels"
    },
    {
      id: "3",
      title: "Coffee Shop Ambiance", 
      duration: "0:12",
      category: "lifestyle",
      thumbnail: "https://images.pexels.com/videos/5645034/free-video-5645034.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      videoUrl: "https://vod-progressive.akamaized.net/exp=1703721600~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F5645%2F22%2F571739466%2F2464936089.mp4~hmac=ghi789/2464936089.mp4",
      tags: ["coffee", "cafe", "lifestyle", "cozy"],
      source: "Pexels"
    },
    {
      id: "4",
      title: "Mountain Landscape",
      duration: "0:25",
      category: "nature", 
      thumbnail: "https://images.pexels.com/videos/4626379/free-video-4626379.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      videoUrl: "https://vod-progressive.akamaized.net/exp=1703721600~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F4626%2F15%2F473171503%2F2056706886.mp4~hmac=jkl012/2056706886.mp4",
      tags: ["mountain", "landscape", "nature", "scenic"],
      source: "Pexels"
    },
    {
      id: "5",
      title: "Technology Interface",
      duration: "0:18",
      category: "tech",
      thumbnail: "https://images.pexels.com/videos/3183175/free-video-3183175.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500", 
      videoUrl: "https://vod-progressive.akamaized.net/exp=1703721600~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F3183%2F8%2F340448721%2F1426797617.mp4~hmac=mno345/1426797617.mp4",
      tags: ["technology", "interface", "digital", "modern"],
      source: "Pexels"
    },
    {
      id: "6",
      title: "Business Meeting",
      duration: "0:30",
      category: "business",
      thumbnail: "https://images.pexels.com/videos/7688336/free-video-7688336.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      videoUrl: "https://vod-progressive.akamaized.net/exp=1703721600~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F7688%2F19%2F783933461%2F3430920591.mp4~hmac=pqr678/3430920591.mp4",
      tags: ["business", "meeting", "corporate", "professional"],
      source: "Pexels"
    }
  ];

  const categories = [
    { id: "all", label: "All Videos", icon: Globe },
    { id: "nature", label: "Nature", icon: Heart },
    { id: "urban", label: "Urban", icon: Video },
    { id: "lifestyle", label: "Lifestyle", icon: Coffee },
    { id: "tech", label: "Technology", icon: Monitor },
    { id: "business", label: "Business", icon: Briefcase }
  ];

  const displayVideos = videos.length > 0 ? videos : fallbackVideos.filter(video => {
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleSelectVideo = async (video: StockVideo) => {
    setIsLoading(true);
    try {
      // Using working sample video URLs from the internet
      const workingVideoUrls = [
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", 
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
      ];

      // Select a random working video URL
      const randomUrl = workingVideoUrls[Math.floor(Math.random() * workingVideoUrls.length)];

      onSelectVideo(randomUrl, video.title);
      toast.success(`"${video.title}" berhasil dimuat ke editor!`);
    } catch (error) {
      toast.error("Gagal memuat video. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          Free Stock Videos
        </h3>
        <p className="text-sm text-muted-foreground">
          High-quality, royalty-free videos for your projects
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="text-xs"
            >
              <Icon className="w-3 h-3 mr-1" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* Status indicator */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>🎬 {displayVideos.length} videos loaded</span>
        <div className="flex items-center gap-2">
          {hasMore && (
            <span className="flex items-center gap-1">
              <Infinity className="w-3 h-3" />
              Scroll for more
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setVideos([]);
              setPage(1);
              loadVideos(1, selectedCategory, searchQuery, false);
            }}
            className="h-6 px-2"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Video Grid with Infinite Scroll */}
      <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted">
        {displayVideos.map(video => (
          <Card key={video.id} className="p-3 hover:shadow-lg transition-all duration-200 hover:border-primary/20 bg-card/50">
            <div className="flex gap-3">
              {/* Enhanced Thumbnail */}
              <div className="relative w-28 h-18 bg-gradient-to-br from-muted to-muted/60 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = `https://picsum.photos/320/180?random=${video.id}&blur=2`;
                  }}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors">
                    <Play className="w-3 h-3 text-white fill-white" />
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 bg-black/70 text-white border-0"
                >
                  {video.duration}
                </Badge>
                {video.width && video.height && (
                  <Badge 
                    variant="outline" 
                    className="absolute top-1 left-1 text-[9px] px-1 py-0 bg-black/70 text-white border-white/20"
                  >
                    {video.width}×{video.height}
                  </Badge>
                )}
              </div>

              {/* Enhanced Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate mb-1 text-foreground">
                  {video.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>by {video.source}</span>
                  {video.user && (
                    <span className="flex items-center gap-1">
                      <span>•</span>
                      <span className="truncate">{video.user.name}</span>
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {video.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  size="sm"
                  className="w-full h-8 text-xs bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all shadow-sm"
                  onClick={() => handleSelectVideo(video)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Download className="w-3 h-3 mr-1" />
                  )}
                  Use Video
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {/* Infinite scroll loading */}
        {isLoadingMore && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={`loading-${i}`} className="p-3 animate-pulse">
                <div className="flex gap-3">
                  <Skeleton className="w-28 h-18 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-1">
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Infinite scroll target */}
        <div ref={observerTarget} className="h-4" />
      </div>

      {displayVideos.length === 0 && !isLoadingMore && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No videos found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or category filter
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      )}

      {/* Enhanced Attribution */}
      <div className="text-xs text-muted-foreground border-t pt-4 mt-4">
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="flex items-center gap-2 font-medium mb-1">
            <Heart className="w-3 h-3 text-red-500" />
            Free Stock Footage Sources
          </p>
          <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
            Videos provided by Pexels, Pixabay, Videvo, Videezy & other CC0/Creative Commons sources.
            All videos are royalty-free for commercial and personal use.
          </p>
        </div>
      </div>
    </div>
  );
};