import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { LayoutGrid, List } from 'lucide-react';
import { blogOperations, Blog } from '../../supabase';
import { SkeletonPageLoader } from '../components/ui/skeleton';
import { Helmet } from 'react-helmet-async';

const blogHeroUrl = 'https://res.cloudinary.com/djvccbmtx/image/upload/q_auto,f_auto,w_1280,h_720,c_fill/v1776426772/30174_1_u66puk.jpg';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

type LayoutView = 'kanban' | 'list';

export default function BlogPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<LayoutView>('kanban');

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogOperations.getAll();
      setBlogs(data || []);
    } catch (error) {
      console.error('Error loading blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  // Kanban/Grid Layout
  const KanbanView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {blogs.map((blog) => (
        <motion.article
          key={blog.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={() => navigate(`/blog/${blog.id}`)}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer hover:-translate-y-1 duration-300"
        >
          {/* Blog Card */}
          <div className="p-6 flex flex-col h-full">
            {/* Author Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">
                {getInitials(blog.author_name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {blog.author_name}
                </p>
                {blog.created_at && (
                  <p className="text-xs text-gray-500">
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Thought Header */}
            <p className="text-lg font-semibold text-red-700 mb-3">
              {blog.author_name}'s thought...
            </p>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors">
              {blog.title}
            </h2>

            {/* Body */}
            <p className="text-gray-700 leading-relaxed flex-grow line-clamp-4 mb-4">
              {blog.body}
            </p>

            {/* Read More Link */}
            <button
              className="text-red-700 hover:text-red-900 font-semibold text-sm transition-colors self-start group-hover:translate-x-1 transform duration-300"
            >
              Read More →
            </button>
          </div>
        </motion.article>
      ))}
    </div>
  );

  // List Layout
  const ListView = () => (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <motion.article
          key={blog.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          onClick={() => navigate(`/blog/${blog.id}`)}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden group cursor-pointer hover:bg-gray-50 duration-300"
        >
          {/* Blog List Item */}
          <div className="p-6 flex items-start gap-6">
            {/* Author Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md">
              {getInitials(blog.author_name)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Author & Date */}
              <div className="flex items-center gap-4 mb-2 flex-wrap">
                <h3 className="font-bold text-gray-900 text-lg">
                  {blog.author_name}
                </h3>
                {blog.created_at && (
                  <span className="text-sm text-gray-500">
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                )}
              </div>

              {/* Thought Prefix */}
              <p className="text-red-700 font-semibold text-sm mb-2">
                {blog.author_name}'s thought...
              </p>

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors">
                {blog.title}
              </h2>

              {/* Preview */}
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 mb-3">
                {blog.body}
              </p>

              {/* Read More */}
              <button className="text-red-700 hover:text-red-900 font-semibold text-sm transition-colors group-hover:translate-x-1 transform duration-300">
                Read Full Article →
              </button>
            </div>

            {/* Right Arrow */}
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-red-50 group-hover:bg-red-100 transition-colors flex-shrink-0">
              <span className="text-red-700 group-hover:translate-x-1 transform duration-300">→</span>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Blog | TSD Events & Decor</title>
        <meta name="description" content="Read the latest thoughts and insights from TSD Events & Decor team" />
      </Helmet>

      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[40vh] sm:h-[50vh] overflow-hidden text-white flex items-center justify-center pt-16 sm:pt-20">
          <div className="absolute inset-0">
            {/* Background Image */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${blogHeroUrl})` }}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60" />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>
          <div className="relative z-10 text-center px-4 max-w-full sm:max-w-4xl w-full sm:w-11/12 mx-auto py-8 sm:py-0">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              Our Blog & Insights
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300"
            >
              Thoughts, tips, and stories from the TSD Events & Decor team
            </motion.p>
          </div>
        </section>

        {/* Blogs Content Section */}
        <main className="py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Layout Toggle */}
            {!loading && blogs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-end gap-2 mb-8"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLayout('kanban')}
                  title="Kanban view"
                  className={`flex items-center justify-center p-2 rounded-full font-medium transition-all duration-300 ${
                    layout === 'kanban'
                      ? 'bg-red-700 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-red-700'
                  }`}
                >
                  <LayoutGrid size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLayout('list')}
                  title="List view"
                  className={`flex items-center justify-center p-2 rounded-full font-medium transition-all duration-300 ${
                    layout === 'list'
                      ? 'bg-red-700 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-red-700'
                  }`}
                >
                  <List size={20} />
                </motion.button>
              </motion.div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="py-12">
                <SkeletonPageLoader />
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">No blogs published yet. Check back soon!</p>
              </div>
            ) : (
              <motion.div
                key={layout}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {layout === 'kanban' ? <KanbanView /> : <ListView />}
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
