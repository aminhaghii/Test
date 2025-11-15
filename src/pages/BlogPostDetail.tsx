import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { blogService, BlogPost } from "@/services/blogService";
import { Calendar, ArrowLeft, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import { getApiUrl } from '@/lib/getApiUrl';
const API_URL = getApiUrl();

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug) {
      loadPost();
      loadRelatedPosts();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const data = await blogService.getPostBySlug(slug!);
      setPost(data);
    } catch (error) {
      console.error('Error loading post:', error);
      navigate('/blog');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRelatedPosts = async () => {
    try {
      const response = await blogService.getPosts({ limit: 4 });
      setRelatedPosts(response.posts.filter(p => p.slug !== slug).slice(0, 3));
    } catch (error) {
      console.error('Error loading related posts:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return `${API_URL}/ALMAS/victoria.jpg`;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_URL}${imageUrl}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neutral-charcoal border-t-transparent mb-4"></div>
            <p className="text-neutral-slate">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-neutral-slate text-lg mb-4">Article not found</p>
            <Link to="/blog" className="text-neutral-charcoal hover:underline font-semibold">
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Image Section */}
      <section className="relative h-[60vh] min-h-[500px] lg:h-[70vh] lg:min-h-[600px] overflow-hidden">
        <img
          src={getImageUrl(post.image_url)}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-charcoal/95 via-neutral-charcoal/70 to-neutral-charcoal/40" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 container mx-auto px-6 lg:px-20 flex items-end pb-12 lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl text-white w-full"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="text-base lg:text-lg">{formatDate(post.published_at || post.created_at)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <article className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-20 max-w-4xl">
          {/* Excerpt */}
          {post.excerpt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12 pb-12 border-b border-neutral-stone/30"
            >
              <p className="text-xl lg:text-2xl text-neutral-slate leading-relaxed font-light">
                {post.excerpt}
              </p>
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="prose prose-lg lg:prose-xl max-w-none
              prose-headings:text-neutral-charcoal prose-headings:font-bold prose-headings:mt-12 prose-headings:mb-6
              prose-h1:text-4xl prose-h1:lg:text-5xl
              prose-h2:text-3xl prose-h2:lg:text-4xl prose-h2:mt-10 prose-h2:mb-5
              prose-h3:text-2xl prose-h3:lg:text-3xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-neutral-slate prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base lg:prose-p:text-lg
              prose-a:text-neutral-charcoal prose-a:font-semibold prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-neutral-charcoal/80
              prose-strong:text-neutral-charcoal prose-strong:font-bold
              prose-ul:text-neutral-slate prose-ul:my-6
              prose-ol:text-neutral-slate prose-ol:my-6
              prose-li:text-neutral-slate prose-li:my-2
              prose-blockquote:border-l-4 prose-blockquote:border-neutral-charcoal prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-neutral-slate
              prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
              prose-code:text-neutral-charcoal prose-code:bg-neutral-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-pre:bg-neutral-charcoal prose-pre:text-white"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="py-16 lg:py-24 bg-neutral-50 border-t border-neutral-stone/20">
          <div className="container mx-auto px-6 lg:px-20 max-w-7xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl lg:text-4xl font-bold text-neutral-charcoal mb-12 text-center lg:text-left"
            >
              {t('blog.relatedPosts') || 'Related Articles'}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={`/blog/${relatedPost.slug}`}
                    className="group block bg-white rounded-lg border border-neutral-stone/30 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:border-neutral-charcoal/50"
                  >
                    <div className="relative w-full h-56 overflow-hidden bg-neutral-100">
                      <img
                        src={getImageUrl(relatedPost.image_url)}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-neutral-slate text-sm mb-3">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(relatedPost.published_at || relatedPost.created_at)}</span>
                      </div>
                      <h3 className="font-display text-lg lg:text-xl font-bold text-neutral-charcoal mb-3 group-hover:text-neutral-charcoal/80 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-neutral-slate text-sm leading-relaxed line-clamp-3">
                        {relatedPost.excerpt || relatedPost.content.substring(0, 120) + '...'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPostDetail;
