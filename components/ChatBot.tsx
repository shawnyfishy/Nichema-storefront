
import { GoogleGenAI } from "@google/genai";
import React, { useEffect, useRef, useState } from 'react';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Welcome to the Nichema Sanctuary. How may I assist your natural beauty ritual today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Use gemini-3-flash-preview for high reliability and compatibility
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages, { role: 'user', text: userMessage }].map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: `You are the Nichema Sanctuary Guide, a warm, nurturing, and highly knowledgeable AI representative for NICHEMA skincare. 
          Your tone is mindful, intentional, and elegant. 
          
          Key brand values to uphold:
          - 100% Natural & Organic: No synthetics, ever.
          - Freshness: Products require refrigeration because they lack synthetic preservatives. Potency over longevity.
          - Sustainability: Glass packaging is designed for creative reuse (spices, planters, etc).
          - Founders Story: Nishma created this out of a personal search for skin nourishment and her expertise as a hairdresser.
          
          Product range: Shatapata Face & Body Butter, Nichema Botanical Toner, Body Scrubs, RootLight Hair Tonic, and Nichema Hair Elixir (26+ oils).
          
          Guidelines:
          1. Be concise but poetic.
          2. If asked about storage, emphasize that refrigeration is a benefit (locks in potency).
          3. If asked about chemicals, firmly state Nichema uses zero synthetic preservatives or artificial fragrances.
          4. Encourage the user to embrace their self-care as a ritual.`,
          temperature: 0.7,
        }
      });

      const aiText = response.text || "I apologize, my connection to the sanctuary is momentary weak. Please try again, dear one.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error: any) {
      console.error("Chat error:", error);
      // Handle the "Requested entity not found" error by suggesting a retry or checking API status
      const errorMessage = error?.message?.includes('404') 
        ? "I am currently realigning with the sanctuary's energy. Please try asking again in a moment."
        : "I'm having trouble connecting right now. Perhaps we can try again in a moment?";
      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden border border-[#3E2723]/5 animate-in fade-in slide-in-from-bottom-10 duration-500">
          {/* Header */}
          <div className="bg-[#3E2723] p-6 text-[#F8F6F0] flex justify-between items-center">
            <div>
              <p className="text-[8px] uppercase tracking-[0.3em] opacity-60">The Sanctuary</p>
              <h3 className="serif italic text-xl tracking-wide">Nichema Guide</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-2xl font-light opacity-60 hover:opacity-100 transition-opacity">&times;</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#F8F6F0]/30">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-[14px] leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-[#F4C9D6] text-[#3E2723] rounded-br-none shadow-sm' 
                    : 'bg-white text-[#3E2723] rounded-bl-none shadow-sm border border-[#3E2723]/5 italic serif text-[16px]'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/50 p-4 rounded-[1.5rem] rounded-bl-none animate-pulse">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-[#3E2723]/30 rounded-full"></div>
                    <div className="w-1 h-1 bg-[#3E2723]/30 rounded-full"></div>
                    <div className="w-1 h-1 bg-[#3E2723]/30 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-[#3E2723]/5">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your ritual..."
                className="w-full bg-[#F8F6F0] rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#F4C9D6] placeholder:italic"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 p-2 text-[#3E2723] opacity-60 hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#3E2723] text-[#F4C9D6] rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform group relative"
      >
        <div className="absolute inset-0 bg-[#F4C9D6] rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 opacity-10"></div>
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
