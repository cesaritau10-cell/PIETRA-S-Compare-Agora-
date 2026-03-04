import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Search, MapPin } from 'lucide-react';
import Markdown from 'react-markdown';
import { getGeminiModel } from '../services/geminiService';
import { cn } from '../lib/utils';

export const GeminiConsultant: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Olá! Sou a assistente da PIETRA\'S. Como posso te ajudar a encontrar a melhor internet em Pelotas hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = getGeminiModel();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })), { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: "Você é a consultora virtual da PIETRA'S Compare sua melhor Internet. Seu objetivo é ajudar usuários da região de Pelotas a encontrar o melhor plano de internet. Seja cordial, profissional e use dados reais via Google Search ou Maps quando necessário. Sempre mencione que para mais informações podem ligar para 53 984782570.",
          tools: [{ googleSearch: {} }]
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text || 'Desculpe, tive um problema ao processar sua solicitação.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ocorreu um erro técnico. Por favor, tente novamente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-bottom border-slate-100 bg-slate-50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Consultora PIETRA'S</h3>
          <p className="text-xs text-slate-500">IA Especialista em Conectividade</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-3 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              msg.role === 'assistant' ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-600"
            )}>
              {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm",
              msg.role === 'assistant' ? "bg-white border border-slate-200 text-slate-800" : "bg-blue-600 text-white"
            )}>
              <div className="markdown-body">
                <Markdown>{msg.content}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-2xl">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre planos em Pelotas..."
            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
