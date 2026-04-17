import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { blogOperations, Blog } from '../../supabase';
import { Helmet } from 'react-helmet-async';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      if (!id) {
        toast.error('Blog not found');
        navigate('/blog');
        return;
      }

      const allBlogs = await blogOperations.getAll();
      const foundBlog = allBlogs?.find((b) => b.id === id);

      if (!foundBlog) {
        toast.error('Blog not found');
        navigate('/blog');
        return;
      }

      setBlog(foundBlog);
    } catch (error) {
      console.error('Error loading blog:', error);
      toast.error('Failed to load blog');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-600 text-lg font-medium"
        >
          Loading blog...
        </motion.div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | TSD Events & Decor</title>
        <meta name="description" content={blog.body.substring(0, 160)} />
      </Helmet>

      {/* Fixed Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/blog')}
        className="fixed top-24 left-4 sm:left-6 z-40 bg-red-700 hover:bg-red-800 text-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 flex items-center justify-center"
        title="Back to Blogs"
      >
        <ArrowLeft size={18} />
      </motion.button>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-16 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          {/* Blog Content */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row gap-4 w-full"
          >
            {/* Author Info & Date Card - Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 border border-gray-100 lg:w-44 lg:flex-shrink-0 h-fit"
            >
              <div className="flex lg:flex-col items-center gap-2 sm:gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-xl flex-shrink-0 shadow-lg"
                >
                  {getInitials(blog.author_name)}
                </motion.div>
                <div className="flex-1 lg:flex-none lg:w-full lg:text-center min-w-0">
                  <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 truncate lg:truncate-none">
                    {blog.author_name}
                  </h3>
                  {blog.created_at && (
                    <p className="text-xs text-gray-600 flex lg:flex-col items-center gap-2 lg:gap-1">
                      <span className="inline-block w-2 h-2 bg-red-700 rounded-full flex-shrink-0 lg:hidden"></span>
                      <span className="truncate lg:truncate-none text-xs">
                        {new Date(blog.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </p>
                  )}
                  {blog.updated_at && blog.updated_at !== blog.created_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      Updated {new Date(blog.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Main Content Section */}
            <div className="flex-1 min-w-0 flex flex-col">
            {/* Blog Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 sm:mb-12"
            >
              {/* Thought Header */}
              <p className="text-base sm:text-xl font-semibold text-red-700 mb-4 sm:mb-6 tracking-wide break-words">
                ✨ {blog.author_name}'s thought...
              </p>

              {/* Title - Responsive */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight break-words">
                {blog.title}
              </h1>

              {/* Decorative Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="h-1 w-16 sm:w-24 bg-gradient-to-r from-red-700 to-red-500 rounded-full"
              />
            </motion.div>

            {/* Blog Body */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-md p-5 sm:p-8 md:p-12 border border-gray-100 flex-1"
            >
              <div className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap font-medium break-words">
                {blog.body}
              </div>
            </motion.div>
            </div>

            {/* Author Bio Footer - Right Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 border border-red-200 lg:w-44 lg:flex-shrink-0 h-fit"
            >
              <div className="flex lg:flex-col items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-lg shadow-lg flex-shrink-0">
                  {getInitials(blog.author_name)}
                </div>
                <div className="min-w-0 flex-1 lg:flex-none lg:w-full lg:text-center">
                  <p className="font-bold text-gray-900 text-xs sm:text-base truncate lg:truncate-none">{blog.author_name}</p>
                  <p className="text-xs text-gray-700 truncate lg:truncate-none">TSD Events & Decor</p>
                </div>
              </div>
              <p className="text-xs text-gray-700 leading-tight">Dedicated to creating unforgettable events and insights on event management.
              </p>
            </motion.div>
          </motion.article>
        </div>
      </main>
    </>
  );
}
