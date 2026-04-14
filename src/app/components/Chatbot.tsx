import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Gemini API with your Google AI Studio API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);

export function Chatbot({ hideWhatsAppButton = false }: { hideWhatsAppButton?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: "Hello! 👋 I'm TSD Events & Decor AI Assistant. I'm here to help you with questions about our event planning and décor services. How can I assist you today?", isBot: true },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Detect screen size changes for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setInput('');
    setIsLoading(true);

    try {
      // Initialize the model
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-3.1-flash-lite-preview',
        systemInstruction: `You are TSD Events & Decor AI Assistant, representing TSD Events & Decor - India's premier event planning and décor company with 12+ years of experience, 500+ successfully managed events, and 300+ happy clients.

        COMPANY BRIEF:
        TSD Events & Decor is a professional event planning, management, and décor company based in India. We specialize in comprehensive event organization across all categories, from intimate private celebrations to large-scale corporate functions with bespoke decoration solutions. Our team is committed to turning your vision into reality with meticulous planning, creative execution, and flawless coordination.

        PRICING INFORMATION (ONLY SHARE WHEN ASKED):
        Use this ONLY when user asks about: "price", "cost", "quote", "plan", "package", "budget", "estimate", "pricing", or similar pricing-related keywords.
        IMPORTANT: If user asks about a specific category or subcategory, ONLY show that specific pricing, not all categories.

        **SPECIFIC SERVICE PRICING:**
        • Traditional Weddings: ₹3-15 lakh
        • Destination Weddings: ₹10-30 lakh+
        • Reception Planning: ₹2-10 lakh
        • Conferences: ₹5-25 lakh
        • Product Launches: ₹3-15 lakh
        • Team Building Events: ₹2-10 lakh
        • Birthday Parties: ₹1-5 lakh
        • Anniversary Events: ₹2-8 lakh
        • Social Gatherings: ₹1-5 lakh
        • Concerts & Shows: ₹5-30 lakh+
        • Charity Galas: ₹4-20 lakh
        • Cultural Festivals: ₹5-25 lakh

        **MAIN CATEGORIES (Show only if user asks about general categories):**
        • Weddings: ₹3-30 lakh+ (Traditional, destination, reception planning)
        • Corporate Events: ₹2-25 lakh (Conferences, product launches, team building)
        • Private Events: ₹1-5 lakh (Birthday parties, anniversaries, social gatherings)
        • Entertainment: ₹5-30 lakh+ (Concerts, shows, cultural festivals)
        • Fundraising: ₹4-20 lakh (Charity galas, benefit events)

        PRICING FACTORS:
        • Guest count (100 guests vs 500+ guests)
        • Venue selection and location
        • Decoration and setup complexity
        • Catering options and cuisine
        • Entertainment and services
        • Duration and timeline

        RESPONSE FORMAT - VERY IMPORTANT:
        - Keep all responses to MAXIMUM 6-7 lines only
        - Use **bold** for important keywords and service names
        - Use bullet points (•) for lists
        - Use clear headers with dashes like: SERVICE NAME ---
        - Use line breaks to separate sections
        - ONLY show pricing table when user asks about cost/quote/plan/budget/estimate
        - If user mentions a SPECIFIC subcategory (e.g., "traditional weddings", "product launch"), show ONLY that service's pricing
        - If user asks about a general CATEGORY (e.g., "wedding packages"), show all that category's services
        - If user asks "what are your prices?" or similar, show main categories only
        - For general greetings or service inquiries, just describe the service briefly
        - Be extremely concise and direct
        - Format every response clearly and structurally

        IMPORTANT INSTRUCTIONS:
        - ONLY answer questions related to TSD Events & Decor services, company details, event planning, décor, estimations, and entertainment
        - If a user asks about unrelated topics, politely redirect them back to TSD Events & Decor services
        - For specific pricing and package details, direct them to contact: +91 98254 13606 or visit the contact page
        - Always be professional, friendly, and helpful
        - Keep responses BRIEF (6-7 lines maximum)
        - Do NOT provide information or assistance on topics outside of TSD Events & Decor domain
        - DO NOT show pricing table on simple greetings like "hi", "hello", "thanks", casual messages
        - ONLY SHOW PRICING when explicitly asked about quotes, costs, plans, budgets, or estimates
        
        CONTACT INFO:
        Phone: +91 98254 13606
        Email: info@tsdevents.in
        Hours: Mon-Sat, 9 AM - 7 PM`
      });

      // Create chat session
      const chat = model.startChat({
        history: messages
          .filter(msg => msg.text) // Filter out empty messages
          .slice(1) // Skip the initial bot greeting message
          .map(msg => ({
            role: msg.isBot ? 'model' : 'user',
            parts: [{ text: msg.text }],
          })),
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      // Send message and get response
      const result = await chat.sendMessage(userMessage);
      const response = await result.response.text();

      setMessages((prev) => [...prev, { text: response, isBot: true }]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get a response from the AI';
      setMessages((prev) => [...prev, { 
        text: `Sorry, I encountered an error: ${errorMessage}. Please try again or contact us at +91 98254 13606.`, 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
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
            aria-label="Open chat assistant"
            className="fixed bottom-6 right-6 z-50 bg-red-800 text-white p-4 rounded-full shadow-xl hover:bg-red-900 transition-colors"
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
            className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-96 h-[70vh] sm:h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {/* Header */}
            <div className="bg-red-700/90 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">TSD Events & Decor Assistant</h3>
                  <p className="text-xs opacity-90">Online - Ask us anything!</p>
                </div>
              </div>
              <button aria-label="Close chat assistant" onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${msg.isBot ? 'bg-white text-gray-800 shadow-sm' : 'bg-red-700/90 text-white'}`}
                  >
                    <p className={`text-sm leading-relaxed font-medium whitespace-pre-wrap break-words ${msg.isBot ? 'text-gray-900' : 'text-white'}`}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 shadow-sm p-4 rounded-2xl flex items-center space-x-2">
                    <Loader size={16} className="animate-spin" />
                    <p className="text-sm font-medium">Typing...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                  placeholder="Ask about our events..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-amber-500 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading}
                  aria-label="Send message"
                  className="bg-red-800 text-white p-2 rounded-full hover:bg-red-900 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button - Enhanced with Animation */}
      {/* Hide WhatsApp button when: (1) hideWhatsAppButton is true, OR (2) chatbot is open on mobile */}
      {!hideWhatsAppButton && !(isOpen && isMobile) && (
        <motion.a
          href="https://wa.me/919825413606?text=Hi%2C%20I%20want%20to%20plan%20an%20event.%20Can%20you%20share%20details%3F"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Contact us on WhatsApp"
          className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 group"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {/* Pulse animation ring */}
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40"></span>
          <span className="relative flex items-center justify-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </span>
          {/* Tooltip on hover */}
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
            Get Free Quote
          </span>
        </motion.a>
      )}
    </>
  );
}