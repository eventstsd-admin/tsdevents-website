import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase, blogOperations, Blog } from '../../supabase';
import { Button } from './ui/button';
import { Trash2, Plus, X, Edit } from 'lucide-react';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function BlogManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Fetch blogs
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

  const handleAddBlog = async () => {
    if (!authorName.trim() || !title.trim() || !body.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        // Update existing blog
        await blogOperations.update(editingId, {
          author_name: authorName,
          title,
          body,
          updated_at: new Date().toISOString(),
        });
        toast.success('Blog updated successfully');
      } else {
        // Create new blog
        await blogOperations.create({
          author_name: authorName,
          title,
          body,
        });
        toast.success('Blog created successfully');
      }

      resetForm();
      await loadBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      setLoading(true);
      await blogOperations.delete(id);
      toast.success('Blog deleted successfully');
      await loadBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingId(blog.id);
    setAuthorName(blog.author_name);
    setTitle(blog.title);
    setBody(blog.body);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setAuthorName('');
    setTitle('');
    setBody('');
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Add Blog Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={20} /> Add New Blog
        </button>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {editingId ? 'Edit Blog' : 'Create New Blog'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Author Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g., John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blog Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Body Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blog Content
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter blog content"
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleAddBlog}
                disabled={loading}
                className="flex-1 bg-red-700 hover:bg-red-800 disabled:bg-red-400 text-white font-medium py-2 rounded-lg transition-colors"
              >
                {loading ? 'Saving...' : editingId ? 'Update Blog' : 'Create Blog'}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blogs List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Recent Blogs</h3>

        {loading && !blogs.length ? (
          <div className="text-center py-8 text-gray-600">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No blogs yet. Create one to get started!</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Author Avatar with Initials */}
                      <div className="w-12 h-12 bg-red-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {getInitials(blog.author_name)}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">
                          {blog.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          by {blog.author_name}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-3 mt-2">
                      {blog.body}
                    </p>
                    {blog.created_at && (
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditBlog(blog)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit blog"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete blog"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
