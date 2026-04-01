import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

const chatbotResponses: Record<string, string> = {
  wedding: "We'd love to help plan your dream wedding! 💍 Our wedding packages start from ₹3 lakh (Basic), ₹6 lakh (Premium), and ₹12 lakh+ (Luxury). We cover venue selection, decor, catering, photography, and entertainment. Would you like to book a consultation?",
  corporate: "Great choice! 🏢 Our corporate event services include conferences, team building, product launches, and annual parties. We handle everything from venue booking to AV equipment and catering. Packages start from ₹2 lakh. What type of corporate event are you planning?",
  budget: "We have flexible packages to suit various budgets! 💰 Basic: ₹2-4 lakh, Premium: ₹5-8 lakh, Luxury: ₹10 lakh+. Each tier includes venue, decor, catering, and coordination. Tell us your budget and we'll customize the perfect package!",
  private: "Private parties are our specialty! 🎉 Whether it's a birthday, anniversary, or intimate gathering, we create magical experiences. Packages start from ₹1.5 lakh. What's the occasion you're celebrating?",
  concert: "Live entertainment at its best! 🎵 We organize concerts, music shows, and cultural festivals. From stage setup to sound systems and artist coordination - we handle it all. Let's discuss your vision!",
  contact: "📞 You can reach us at: +91 98254 13606 | 📧 info@tsdevents.in | Or visit the 'Contact' page to reach out. We're available Mon-Sat, 9 AM - 7 PM.",
  default: "Hello! 👋 I'm here to help with all your event planning queries. Ask me about: Wedding planning, Corporate events, Budget packages, Private parties, Concerts & shows, or Contact details. How can I assist you today?",
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: chatbotResponses.default, isBot: true },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setInput('');

    // Simple keyword matching
    setTimeout(() => {
      let response = chatbotResponses.default;
      const lowerInput = userMessage.toLowerCase();

      if (lowerInput.includes('wedding') || lowerInput.includes('marriage') || lowerInput.includes('shaadi')) {
        response = chatbotResponses.wedding;
      } else if (lowerInput.includes('corporate') || lowerInput.includes('business') || lowerInput.includes('conference')) {
        response = chatbotResponses.corporate;
      } else if (lowerInput.includes('budget') || lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('lakh')) {
        response = chatbotResponses.budget;
      } else if (lowerInput.includes('party') || lowerInput.includes('birthday') || lowerInput.includes('anniversary')) {
        response = chatbotResponses.private;
      } else if (lowerInput.includes('concert') || lowerInput.includes('show') || lowerInput.includes('music')) {
        response = chatbotResponses.concert;
      } else if (lowerInput.includes('contact') || lowerInput.includes('phone') || lowerInput.includes('email')) {
        response = chatbotResponses.contact;
      }

      setMessages((prev) => [...prev, { text: response, isBot: true }]);
    }, 500);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-red-700/90 text-white p-4 rounded-full shadow-2xl hover:bg-red-800/90 transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <MessageCircle size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {/* Header */}
            <div className="bg-red-700/90 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">TSD Events Assistant</h3>
                  <p className="text-xs opacity-90">Online - Ask us anything!</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.isBot
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'bg-red-700/90 text-white'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about our events..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-amber-500 text-sm"
                />
                <Button
                  onClick={handleSend}
                  className="bg-red-700/90 text-white p-2 rounded-full hover:bg-red-800/90 hover:shadow-lg"
                >
                  <Send size={20} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/919825413606?text=Hi! I'm interested in TSD Events services"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 left-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/50 transition-shadow"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </motion.a>
    </>
  );
}