import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Mail, User, Calendar, MessageSquare, MessageCircle, Phone, ChevronDown, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { inquiryOperations, type Inquiry } from '../../supabase';

// ─── Helpers ────────────────────────────────────────────────────────────────

function parsePhone(message: string): string {
  const match = message.match(/Phone:\s*([+\d\s\-().]+)/i);
  if (!match) return '';
  return match[1].trim().replace(/\s+/g, '');
}

function stripPhone(message: string): string {
  return message.replace(/\n\nPhone:.*$/i, '').trim();
}

function toWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length >= 12) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function buildWhatsAppReply(inquiry: Inquiry): string {
  const cleanMessage = stripPhone(inquiry.message);
  return (
    `Hello ${inquiry.customer_name}! 👋\n\n` +
    `Thank you for reaching out to *TSD Events & Decor*.\n\n` +
    `We received your inquiry:\n` +
    `"${cleanMessage.slice(0, 200)}${cleanMessage.length > 200 ? '…' : ''}"\n\n` +
    `We are happy to help you plan your event. Our team will get back to you with full details shortly.\n\n` +
    `Feel free to ask any questions!\n\n` +
    `— *TSD Events & Decor Team* 🎊\n` +
    `📞 +91 98254 13606\n` +
    `🌐 tsdevents.in`
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function InquiryManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Email compose modal
  const [emailTarget, setEmailTarget] = useState<Inquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

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

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(null);
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

  const handleWhatsAppReply = (inquiry: Inquiry) => {
    const phone = parsePhone(inquiry.message);
    if (!phone) {
      toast.error('No phone number found in this inquiry');
      return;
    }
    const wa = toWhatsAppNumber(phone);
    const text = encodeURIComponent(buildWhatsAppReply(inquiry));
    window.open(`https://wa.me/${wa}?text=${text}`, '_blank');
    toast.success(`Opening WhatsApp for ${inquiry.customer_name}`);
  };

  const openEmailCompose = (inquiry: Inquiry) => {
    setEmailTarget(inquiry);
    // Pre-fill a polite starter
    setReplyMessage(
      `Dear ${inquiry.customer_name},\n\nThank you for reaching out to TSD Events & Decor!\n\n` +
      `We have reviewed your inquiry and would like to share the following:\n\n` +
      `[Your reply here]\n\n` +
      `Please don't hesitate to get in touch if you have any further questions.\n\n` +
      `Warm regards,\nTSD Events & Decor Team\n📞 +91 98254 13606`
    );
  };

  const handleSendEmail = async () => {
    if (!emailTarget || !replyMessage.trim()) {
      toast.error('Please write a message before sending');
      return;
    }

    setSendingEmail(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const res = await fetch(
        `${supabaseUrl}/functions/v1/send-inquiry-reply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            to: emailTarget.email,
            customerName: emailTarget.customer_name,
            replyMessage: replyMessage.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.details?.message || data?.error || 'Send failed');
      }

      toast.success(`Email sent to ${emailTarget.customer_name} (${emailTarget.email})`);
      setEmailTarget(null);
      setReplyMessage('');
    } catch (err: any) {
      console.error('Email send error:', err);
      toast.error(`Failed to send email: ${err.message}`);
    } finally {
      setSendingEmail(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

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
          {inquiries.map((inquiry) => {
            const phone = parsePhone(inquiry.message);
            const displayMessage = stripPhone(inquiry.message);

            return (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* ── Always-visible header row ── */}
                <div
                  className="flex items-center justify-between gap-4 cursor-pointer select-none"
                  onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400 shrink-0" />
                      <h3 className="font-semibold text-gray-900">{inquiry.customer_name}</h3>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-600 truncate">{inquiry.email}</span>
                    </div>
                    {phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-600">{phone}</span>
                      </div>
                    )}
                    {inquiry.created_at && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(inquiry.created_at)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Delete — inline confirm */}
                    {confirmDeleteId === inquiry.id ? (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1"
                      >
                        <span className="text-xs font-medium text-red-700 whitespace-nowrap">Delete?</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(inquiry.id); }}
                          className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                          className="text-xs font-medium text-gray-500 hover:text-gray-700 px-1 transition-colors"
                        >
                          Cancel
                        </button>
                      </motion.div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(inquiry.id); }}
                        disabled={deletingId === inquiry.id}
                        className="text-red-800 hover:text-red-900 hover:bg-red-100"
                      >
                        {deletingId === inquiry.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-800" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedId === inquiry.id ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                {/* ── Collapsible details ── */}
                <AnimatePresence initial={false}>
                  {expandedId === inquiry.id && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed font-sans">
                            {displayMessage}
                          </pre>
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          {/* WhatsApp */}
                          {phone ? (
                            <Button
                              size="sm"
                              onClick={() => handleWhatsAppReply(inquiry)}
                              className="bg-green-600 hover:bg-green-700 text-white gap-2"
                            >
                              <MessageCircle className="h-4 w-4" />
                              Reply on WhatsApp
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled className="text-gray-400 gap-2 cursor-not-allowed">
                              <MessageCircle className="h-4 w-4" />
                              No phone
                            </Button>
                          )}

                          {/* Email — opens compose modal */}
                          <Button
                            size="sm"
                            onClick={() => openEmailCompose(inquiry)}
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                          >
                            <Mail className="h-4 w-4" />
                            Reply via Email
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Email Compose Modal ── */}
      <AnimatePresence>
        {emailTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Compose Email Reply</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    To: <span className="font-medium text-gray-700">{emailTarget.customer_name}</span>
                    {' '}&lt;{emailTarget.email}&gt;
                  </p>
                </div>
                <button
                  onClick={() => { setEmailTarget(null); setReplyMessage(''); }}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Original inquiry (read-only preview) */}
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-1">Original Inquiry:</p>
                <p className="text-sm text-gray-600 line-clamp-3">{stripPhone(emailTarget.message)}</p>
              </div>

              {/* Compose area */}
              <div className="px-6 py-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
                <textarea
                  rows={10}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="Type your reply here..."
                />
                <p className="text-xs text-gray-400 mt-1">This message will be sent as a branded HTML email via Resend.</p>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                <Button
                  variant="outline"
                  onClick={() => { setEmailTarget(null); setReplyMessage(''); }}
                  disabled={sendingEmail}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendEmail}
                  disabled={sendingEmail || !replyMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  {sendingEmail ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}