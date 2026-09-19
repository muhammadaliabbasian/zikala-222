import React, { useState } from 'react';
import { ArrowRight, BookOpen, Calendar, Clock, User, X } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogs.ts';
import { BlogPost } from '../types.ts';

interface BlogPageProps {
  onNavigate: (page: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
          Horological Chronicle
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
          The Zikala Journal
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          In-depth guides, mechanical histories, and styling perspectives written by master horologists in Pakistan.
        </p>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group bg-[#121212] border border-[#222222] hover:border-[#D4AF37]/60 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] overflow-hidden bg-[#181818]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-black/80 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md backdrop-blur-sm">
                  {post.category}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4 text-[11px] text-gray-500 mb-2">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" /> {post.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" /> {post.readTime}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  {post.title}
                </h2>

                <p className="text-xs sm:text-sm text-gray-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-[#1C1C1C]">
              <span className="text-xs text-gray-500 font-medium flex items-center">
                <User className="w-3.5 h-3.5 mr-1" /> {post.author}
              </span>
              <span className="text-xs font-bold text-[#D4AF37] flex items-center group-hover:translate-x-1 transition-transform">
                Read Full Story <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 flex items-center justify-center">
          <div
            onClick={() => setSelectedPost(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <div className="relative bg-[#131313] border border-[#2E2E2E] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 p-6 sm:p-10 space-y-6">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-5 right-5 p-2 bg-[#1E1E1E] text-gray-400 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                {selectedPost.category} • {selectedPost.readTime}
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                {selectedPost.title}
              </h2>
              <div className="flex items-center space-x-3 text-xs text-gray-400 pt-1">
                <span>By {selectedPost.author}</span>
                <span>•</span>
                <span>Published on {selectedPost.date}</span>
              </div>
            </div>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-black border border-[#242424]">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content blocks */}
            <div className="text-xs sm:text-sm text-gray-300 leading-relaxed space-y-4 font-light">
              {selectedPost.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-6 border-t border-[#222222] flex justify-between items-center">
              <span className="text-xs text-gray-500 italic">
                Zikala Horological Gazette — Karachi, Pakistan
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="gold-button px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
