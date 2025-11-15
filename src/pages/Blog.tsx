import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { blogService, BlogPost } from "@/services/blogService";
import { ArrowRight, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import { getApiUrl } from '@/lib/getApiUrl';
import { getImageUrl } from '@/lib/getImageUrl';
const API_URL = getApiUrl();

const Blog = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 12;

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const offset = (currentPage - 1) * postsPerPage;
      const response = await blogService.getPosts({
        limit: postsPerPage,
        offset,
      });
      setPosts(response.posts);
      setTotalPosts(response.total);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return `getImageUrl('/ALMAS/victoria.jpg')`;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_URL}${imageUrl}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const featuredPosts = posts.slice(0, 3);
  const listPosts = posts.slice(3);
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <img 
          src={`getImageUrl('/ALMAS/victoria.jpg')`}
          alt="Blog Hero"
          className="w-full h-full object-cover scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6"
            >
              INSPIRATIONS & TRENDS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl opacity-90 max-w-2xl mx-auto"
            >
              Discover the latest insights, trends, and inspiration from the world of premium ceramics
            </motion.p>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-gradient-to-br from-stone-50 to-stone-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-20 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 sm:mb-10 md:mb-12 lg:mb-16"
            >
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-charcoal mb-2 sm:mb-3">
                FEATURED <strong>ARTICLES</strong>
              </h2>
              <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-neutral-charcoal"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Link to={`/blog/${post.slug}`} className="block h-full">
                    <div className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <img
                        src={getImageUrl(post.image_url)}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 md:p-6 lg:p-8">
                        <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm mb-2 sm:mb-3">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{formatDate(post.published_at || post.created_at)}</span>
                        </div>
                        <h3 className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 line-clamp-2 group-hover:text-white transition-colors duration-300">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-white/90 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm md:text-base group-hover:gap-3 transition-all duration-300">
                          <span>Read Article</span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Blog List Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20 max-w-7xl">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-10 md:mb-12 lg:mb-16"
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-charcoal mb-2 sm:mb-3 text-center sm:text-left">
              ALL <strong>ARTICLES</strong>
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-neutral-charcoal mx-auto sm:mx-0"></div>
          </motion.div>

          {/* Blog Posts List */}
          {isLoading ? (
            <div className="space-y-4 sm:space-y-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-24 sm:h-28 md:h-32 bg-neutral-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : listPosts.length === 0 && featuredPosts.length === 0 ? (
            <div className="text-center py-16 sm:py-20 md:py-24">
              <p className="text-neutral-slate text-base sm:text-lg md:text-xl">
                No blog posts available yet.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-0 border-t border-neutral-stone/30">
                {listPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="border-b border-neutral-stone/30"
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block py-6 sm:py-7 md:py-8 hover:bg-stone-50/50 transition-colors duration-200 group"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
                        {/* Image */}
                        <div className="flex-shrink-0 w-full sm:w-48 md:w-64 lg:w-80 h-48 sm:h-40 md:h-48 lg:h-56 rounded-lg overflow-hidden bg-neutral-200">
                          <img
                            src={getImageUrl(post.image_url)}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-center gap-3 sm:gap-4 text-neutral-slate text-xs sm:text-sm mb-2 sm:mb-3">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{formatDate(post.published_at || post.created_at)}</span>
                            </div>
                          </div>
                          <h2 className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-neutral-charcoal mb-2 sm:mb-3 group-hover:text-neutral-charcoal/80 transition-colors duration-200">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="text-neutral-slate text-sm sm:text-base md:text-lg mb-3 sm:mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-neutral-charcoal font-semibold text-xs sm:text-sm md:text-base group-hover:gap-3 transition-all duration-300">
                            <span>Read More</span>
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-12 sm:mt-14 md:mt-16 lg:mt-20">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 border border-neutral-stone/30 text-neutral-charcoal font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-charcoal hover:text-white transition-all duration-200 text-sm sm:text-base touch-manipulation"
                  >
                    PREVIOUS
                  </button>
                  <div className="text-neutral-slate text-sm sm:text-base md:text-lg font-medium">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 border border-neutral-stone/30 text-neutral-charcoal font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-charcoal hover:text-white transition-all duration-200 text-sm sm:text-base touch-manipulation"
                  >
                    NEXT
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
