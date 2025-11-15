import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { blogService, BlogPost } from "@/services/blogService";

import { getImageUrl } from '@/lib/getImageUrl';

// Random widths and heights for visual variety
const sizes = [
  { width: '520px', height: '320px' },
  { width: '480px', height: '380px' },
  { width: '550px', height: '300px' },
  { width: '500px', height: '360px' },
  { width: '530px', height: '340px' },
  { width: '490px', height: '370px' },
  { width: '540px', height: '310px' },
];

type BlogPostWithSize = BlogPost & {
  width: string;
  height: string;
};

const BlogSection = () => {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [posts, setPosts] = useState<BlogPostWithSize[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await blogService.getPosts({ limit: 10 });
      const postsWithSizes: BlogPostWithSize[] = response.posts.map((post, index) => ({
        ...post,
        ...sizes[index % sizes.length]
      }));
      setPosts(postsWithSizes);
    } catch (error) {
      // Silently use fallback posts if API is unavailable
      const fallbackPosts: BlogPostWithSize[] = [
        {
          id: 'fallback-1',
          title: 'Latest Trends in Iranian Ceramic Tile Design',
          slug: 'latest-trends',
          excerpt: 'Discover the newest design trends and innovations in Iranian ceramic tile manufacturing.',
          content: 'Sample content',
          image_url: '/ALMAS/victoria.jpg',
          is_published: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...sizes[0]
        },
        {
          id: 'fallback-2',
          title: 'Sustainable Manufacturing Practices',
          slug: 'sustainable-manufacturing',
          excerpt: 'Learn about our commitment to environmental sustainability.',
          content: 'Sample content',
          image_url: '/ALMAS/ROJINA.jpg',
          is_published: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...sizes[1]
        },
        {
          id: 'fallback-3',
          title: 'Choosing the Right Tiles',
          slug: 'choosing-tiles',
          excerpt: 'Expert tips for selecting perfect ceramic tiles.',
          content: 'Sample content',
          image_url: '/ALMAS/PORPJA.jpg',
          is_published: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...sizes[2]
        },
      ];
      setPosts(fallbackPosts);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getImageUrlForPost = (imageUrl?: string) => {
    if (!imageUrl) return getImageUrl('/ALMAS/victoria.jpg');
    if (imageUrl.startsWith('http')) return imageUrl;
    return getImageUrl(imageUrl);
  };

  // Calculate responsive scroll amount
  const getScrollAmount = () => {
    if (typeof window === 'undefined') return 530;
    const width = window.innerWidth;
    if (width < 640) return width * 0.85; // Mobile: 85% of viewport
    if (width < 1024) return width * 0.6; // Tablet: 60% of viewport
    return 530; // Desktop: fixed amount
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = getScrollAmount();
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <section className="py-12 sm:py-14 md:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 max-w-[1800px]">
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-neutral-charcoal font-bold mb-2">
              BLOG <strong>ARTICLES</strong>
            </h2>
            <p className="text-sm sm:text-base text-neutral-slate mt-2">
              {t('blog.subtitle') || 'Latest insights, trends, and inspiration from the world of ceramic tiles'}
            </p>
          </div>
          <Link 
            to="/blog" 
            className="hidden md:inline-flex items-center gap-2 text-luxury-gold font-semibold hover:gap-3 transition-all text-sm sm:text-base"
          >
            {t('blog.viewAll') || 'View all posts'} 
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>

        <div className="relative group">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-neutral-charcoal" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 sm:gap-8 md:gap-10 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          >
            {isLoading ? (
              <div className="flex gap-4 sm:gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[420px] h-[400px] sm:h-[450px] md:h-[500px] bg-neutral-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 w-full">
                <p className="text-neutral-slate text-sm sm:text-base">No blog posts available</p>
              </div>
            ) : (
              posts.map((post, i) => (
              <div
                key={post.id}
                className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[420px]"
                style={{ 
                  width: typeof window !== 'undefined' && window.innerWidth >= 768 ? post.width : undefined,
                  minWidth: typeof window !== 'undefined' && window.innerWidth >= 768 ? post.width : undefined
                }}
              >
                <Link to={`/blog/${post.slug}`} className="block group/card">
                  <motion.article
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative overflow-hidden rounded-lg border border-neutral-stone/30 bg-card hover:border-luxury-gold/50 transition-all duration-300 h-full"
                  >
                    {/* Image */}
                    <div 
                      className="relative w-full overflow-hidden"
                      style={{ 
                        height: typeof window !== 'undefined' && window.innerWidth >= 768 ? post.height : 'auto',
                        aspectRatio: typeof window !== 'undefined' && window.innerWidth < 768 ? '4/3' : undefined
                      }}
                    >
                      <img
                        src={getImageUrlForPost(post.image_url)}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-charcoal/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-neutral-slate text-sm mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-xl font-bold text-neutral-charcoal mb-3 group-hover/card:text-luxury-gold transition-colors duration-300">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-neutral-slate text-sm leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt || post.content.substring(0, 150) + '...'}
                      </p>

                      {/* Read More */}
                      <div className="flex items-center gap-2 text-luxury-gold font-semibold text-sm">
                        <span>{t('blog.readMore') || 'Read more'}</span>
                        <ArrowRight className="w-4 h-4 group-hover/card:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </div>
              ))
            )}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-neutral-charcoal" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

