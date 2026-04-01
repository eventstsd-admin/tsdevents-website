import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Mail, User, Calendar, MessageSquare, Reply, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { inquiryOperations, type Inquiry } from '../../supabase';

export function InquiryManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Inquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchInquiries = async () => {
    try {
      const data = await inquiryOperations.getAll();
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleReply = async () => {
    if (!replyingTo || !replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setSendingReply(true);
    try {
      // TODO: Integrate with Resend API to send email
      // For now, just simulate the email sending process
      console.log('Would send email reply:', {
        to: replyingTo.email,
        subject: `Re: Your inquiry - TSD Events & Decor`,
        message: replyMessage,
        customerName: replyingTo.customer_name,
      });

      toast.success(`Reply sent to ${replyingTo.customer_name}! (Email integration pending)`);
      setReplyingTo(null);
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await inquiryOperations.delete(id);
      setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
      toast.success('Inquiry deleted successfully');
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast.error('Failed to delete inquiry');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
        <p className="text-gray-500">Customer inquiries will appear here when submitted through the contact form.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Customer Inquiries</h2>
        <div className="text-sm text-gray-500">
          {inquiries.length} {inquiries.length === 1 ? 'inquiry' : 'inquiries'}
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {inquiries.map((inquiry) => (
            <motion.div
              key={inquiry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <h3 className="font-semibold text-gray-900">{inquiry.customer_name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a 
                        href={`mailto:${inquiry.email}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {inquiry.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                      {inquiry.message}
                    </pre>
                  </div>

                  {inquiry.created_at && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Received {formatDate(inquiry.created_at)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReplyingTo(inquiry)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(inquiry.id)}
                    disabled={deletingId === inquiry.id}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    {deletingId === inquiry.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyingTo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Reply to {replyingTo.customer_name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{replyingTo.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyMessage('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Original Message */}
              <div className="p-6 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Original Message:</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                    {replyingTo.message}
                  </pre>
                </div>
              </div>

              {/* Reply Form */}
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reply-message" className="text-sm font-medium text-gray-900">
                      Your Reply
                    </Label>
                    <Textarea
                      id="reply-message"
                      placeholder="Type your reply to the customer..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={6}
                      className="mt-2 w-full resize-none"
                    />
                  </div>
                  
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyMessage('');
                      }}
                      disabled={sendingReply}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleReply}
                      disabled={sendingReply || !replyMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {sendingReply ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Reply
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}