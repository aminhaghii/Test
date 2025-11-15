import { useMemo, useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, Download, X, Loader2, Check, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { aiService } from "@/services/aiService";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: string;
  name: string;
  image_url?: string;
  texture_images?: string[];
  dimension: string;
  surface: string;
  body_type?: string;
  category?: string;
  color?: string;
}

interface TextureItem {
  id: string; // unique per product+index
  productId: string;
  name: string;
  previewUrl: string;
  dimension: string;
  surface: string;
  body_type?: string;
  category?: string;
  color?: string;
}

interface TileVisualizerProps {
  products: Product[];
}

const TileVisualizer = ({ products }: TileVisualizerProps) => {
  const { t } = useLanguage();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedTextures, setSelectedTextures] = useState<TextureItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cooldownSec, setCooldownSec] = useState<number>(0);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [showTileSelector, setShowTileSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterDimension, setFilterDimension] = useState<string | "all">("all");
  const [filterSurface, setFilterSurface] = useState<string | "all">("all");
  const [filterBodyType, setFilterBodyType] = useState<string | "all">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downscaleImage = (src: string, maxSize = 1280): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(src);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = () => resolve(src);
      img.src = src;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t('tileVisualizer.imageSizeError'));
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const raw = event.target?.result as string;
        const resized = await downscaleImage(raw, 1280);
        setUploadedImage(resized);
        setResultImage(null);
        setSelectedTextures([]);
        toast.success(t('tileVisualizer.imageUploadSuccess'));
      };
      reader.readAsDataURL(file);
    }
  };

  const textures: TextureItem[] = useMemo(() => {
    const items: TextureItem[] = [];
    products.forEach((p) => {
      if (p.texture_images && p.texture_images.length) {
        p.texture_images.forEach((url, idx) => {
          if (!url) return;
          items.push({
            id: `${p.id}::${idx}`,
            productId: p.id,
            name: p.name,
            previewUrl: url,
            dimension: p.dimension,
            surface: p.surface,
            body_type: p.body_type,
            category: p.category,
            color: p.color,
          });
        });
      }
    });
    return items;
  }, [products]);

  const uniqueDimensions = useMemo(() => Array.from(new Set(products.map(p => p.dimension))).sort(), [products]);
  const uniqueSurfaces = useMemo(() => Array.from(new Set(products.map(p => p.surface))).sort(), [products]);
  const uniqueBodyTypes = useMemo(() => Array.from(new Set(products.map(p => p.body_type).filter(Boolean) as string[])).sort(), [products]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const filteredTextures = useMemo(() => {
    return textures.filter(t => {
      if (filterDimension !== "all" && t.dimension !== filterDimension) return false;
      if (filterSurface !== "all" && t.surface !== filterSurface) return false;
      if (filterBodyType !== "all" && t.body_type !== filterBodyType) return false;
      if (debouncedSearch && !t.name.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      return true;
    });
  }, [textures, filterDimension, filterSurface, filterBodyType, debouncedSearch]);

  const handleTextureToggle = (tex: TextureItem) => {
    if (selectedTextures.find(t => t.id === tex.id)) {
      setSelectedTextures(prev => prev.filter(t => t.id !== tex.id));
      toast.success(t('tileVisualizer.textureRemoved'));
      return;
    }
    if (selectedTextures.length >= 2) {
      toast.error(t('tileVisualizer.maxTexturesError'));
      return;
    }
    setSelectedTextures(prev => [...prev, tex]);
    toast.success(t('tileVisualizer.textureSelected').replace('{name}', tex.name));
  };

  const resolveApiKey = (): string | undefined => {
    // Support multiple env names to match user's .env naming
    const candidates = [
      import.meta.env.VITE_GEMINI_API_KEY,
      import.meta.env.VITE_GEMENI_API_KEY, // common misspelling
      import.meta.env.VITE_GEMINI_API,
      import.meta.env.VITE_GEMENI_API,
    ] as (string | undefined)[];
    return candidates.find(Boolean);
  };

  const handleVisualize = async () => {
    if (!uploadedImage) {
      toast.error(t('tileVisualizer.uploadImageFirst'));
      return;
    }

    if (selectedTextures.length === 0) {
      toast.error(t('tileVisualizer.selectTextureError'));
      return;
    }

    setIsProcessing(true);
    
    const fetchImageAsBase64 = async (url: string) => {
      try {
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) throw new Error(`Failed to fetch texture (${response.status})`);
        const blob = await response.blob();
        const reader = new FileReader();
        return await new Promise<{ data: string; mimeType: string }>((resolve, reject) => {
          reader.onloadend = () => {
            const result = reader.result as string;
            if (!result) {
              reject(new Error('Empty texture data'));
              return;
            }
            const [, base64] = result.split(',');
            resolve({ data: base64 || result, mimeType: blob.type || 'image/png' });
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Texture fetch error:', error);
        throw error;
      }
    };

    try {
      // Prepare textures as data URLs for the backend (avoid CORS on server)
      const textureDataUrls: string[] = [];
      for (const tex of selectedTextures) {
        const image = await fetchImageAsBase64(tex.previewUrl);
        textureDataUrls.push(`data:${image.mimeType};base64,${image.data}`);
      }

      const { imageDataUrl } = await aiService.visualize({
        roomDataUrl: uploadedImage,
        textureDataUrls,
      });

      setResultImage(imageDataUrl);
      toast.success(t('tileVisualizer.visualizationGenerated'));
    } catch (error: any) {
      console.error('Visualization error:', error);
      if (error && typeof error === 'object' && 'retryAfter' in error) {
        const seconds = Number((error as any).retryAfter) || 60;
        setCooldownSec(seconds);
        toast.error(t('tileVisualizer.rateLimitError').replace('{seconds}', seconds.toString()));
        const interval = setInterval(() => {
          setCooldownSec(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(error instanceof Error ? error.message : t('tileVisualizer.generationFailed'));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `tile-visualization-${Date.now()}.jpg`;
    link.click();
    toast.success(t('tileVisualizer.imageDownloaded'));
  };

  const handleReset = () => {
    setUploadedImage(null);
    setSelectedTextures([]);
    setResultImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Group textures by dimension for the dialog sections
  const groupedByDimension = useMemo(() => {
    const map = new Map<string, TextureItem[]>();
    filteredTextures.forEach(tex => {
      if (!map.has(tex.dimension)) map.set(tex.dimension, []);
      map.get(tex.dimension)!.push(tex);
    });
    return map;
  }, [filteredTextures]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-gold/10 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-luxury-gold" />
          <span className="text-sm font-semibold text-luxury-gold">{t('tileVisualizer.aiPoweredVisualization')}</span>
        </div>
        <h2 className="text-4xl font-display font-bold mb-4">{t('tileVisualizer.visualizeTilesTitle')}</h2>
        <p className="text-lg text-muted-foreground">{t('tileVisualizer.visualizeTilesDesc')}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Upload & Selection */}
        <div className="space-y-6">
          {/* Upload Section */}
          <Card className="border-2 border-dashed border-neutral-charcoal/30 hover:border-neutral-charcoal/60 transition-colors">
            <CardContent className="p-8">
              <div className="text-center">
                {!uploadedImage ? (
                  <>
                    <Upload className="w-16 h-16 mx-auto mb-4 text-neutral-charcoal" />
                    <h3 className="text-xl font-bold mb-2">{t('tileVisualizer.uploadRoomPhoto')}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{t('tileVisualizer.uploadRoomPhotoDesc')}</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="room-upload" />
                    <button onClick={() => fileInputRef.current?.click()} className="text-neutral-charcoal font-semibold">{t('tileVisualizer.chooseImage')}</button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden">
                      <img src={uploadedImage} alt="Uploaded room" className="w-full h-auto max-h-[300px] object-cover" />
                      <button onClick={handleReset} className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                      <Check className="w-4 h-4" />
                      <span>{t('tileVisualizer.imageUploadSuccess')}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Selected Textures */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{t('tileVisualizer.selectedTextures').replace('{count}', selectedTextures.length.toString())}</h3>
                <Button onClick={() => setShowTileSelector(true)} variant="outline" size="sm" disabled={!uploadedImage}>
                  <Filter className="w-4 h-4 mr-2" /> {t('tileVisualizer.browseTextures')}
                </Button>
              </div>

              {selectedTextures.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">{t('tileVisualizer.noTexturesSelected')}</p>
              ) : (
                <div className="space-y-3">
                  {selectedTextures.map(tex => (
                    <div key={tex.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <img src={tex.previewUrl} alt={tex.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{tex.name}</p>
                        <p className="text-xs text-muted-foreground">{tex.dimension} • {tex.surface}{tex.body_type ? ` • ${tex.body_type}` : ''}</p>
                      </div>
                      <button onClick={() => handleTextureToggle(tex)} className="p-2 hover:bg-destructive/10 rounded text-destructive transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={handleVisualize} disabled={!uploadedImage || selectedTextures.length === 0 || isProcessing || cooldownSec > 0} className="w-full mt-6 bg-luxury-gold hover:bg-luxury-bronze text-neutral-charcoal font-semibold">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('tileVisualizer.generatingVisualization')}
                  </>
                ) : cooldownSec > 0 ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('tileVisualizer.tryAgainIn').replace('{seconds}', cooldownSec.toString())}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" /> {t('tileVisualizer.generateAIVisualization')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Result */}
        <div>
          <Card className="h-full">
            <CardContent className="p-8">
              {resultImage ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{t('tileVisualizer.aiVisualizationResult')}</h3>
                    <Button onClick={handleDownload} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" /> {t('tileVisualizer.download')}
                    </Button>
                  </div>
                  <div className="rounded-lg overflow-hidden border-2 border-neutral-charcoal/30">
                    <img src={resultImage} alt="Visualization result" className="w-full h-auto" />
                  </div>
                  <div className="bg-luxury-gold/10 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-luxury-gold mb-2">{t('tileVisualizer.texturesApplied')}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTextures.map(tex => (
                        <Badge key={tex.id} variant="secondary">{tex.name}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                  <div className="w-24 h-24 rounded-full bg-luxury-gold/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-12 h-12 text-luxury-gold" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t('tileVisualizer.visualizationWillAppear')}</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">{t('tileVisualizer.visualizationWillAppearDesc')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Texture Selector Dialog */}
      <Dialog open={showTileSelector} onOpenChange={setShowTileSelector}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('tileVisualizer.selectTextures')}</DialogTitle>
          </DialogHeader>

          {/* Filters */}
          <div className="grid md:grid-cols-4 gap-3 mb-6">
            <div className="col-span-2">
              <input
                type="text"
                placeholder={t('tileVisualizer.searchByProductName')}
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="px-3 py-2 rounded-md border bg-background" value={filterDimension} onChange={(e)=>setFilterDimension(e.target.value)}>
              <option value="all">{t('tileVisualizer.allDimensions')}</option>
              {uniqueDimensions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="px-3 py-2 rounded-md border bg-background" value={filterSurface} onChange={(e)=>setFilterSurface(e.target.value)}>
              <option value="all">{t('tileVisualizer.allSurfaces')}</option>
              {uniqueSurfaces.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="px-3 py-2 rounded-md border bg-background" value={filterBodyType} onChange={(e)=>setFilterBodyType(e.target.value)}>
              <option value="all">{t('tileVisualizer.allBodyTypes')}</option>
              {uniqueBodyTypes.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          
          <div className="space-y-8 py-2">
            {Array.from(groupedByDimension.entries()).map(([dimension, list]) => (
              <div key={dimension}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="text-luxury-gold">{dimension}</span>
                  <span className="text-sm text-muted-foreground font-normal">({list.length} {t('tileVisualizer.textures')})</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {list.map(tex => (
                    <Card key={tex.id} onClick={() => handleTextureToggle(tex)} className={`cursor-pointer transition-all hover:shadow-lg ${selectedTextures.find(t => t.id === tex.id) ? 'ring-2 ring-luxury-gold' : ''}`}>
                      <CardContent className="p-3">
                        <div className="aspect-square mb-2 rounded overflow-hidden bg-muted">
                          <img src={tex.previewUrl} alt={tex.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs font-semibold truncate">{tex.name}</p>
                        <p className="text-xs text-muted-foreground">{tex.surface}{tex.body_type ? ` • ${tex.body_type}` : ''}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {filteredTextures.length === 0 && (
              <div className="text-center text-muted-foreground py-12">{t('tileVisualizer.noTexturesMatch')}</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TileVisualizer;

