import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('chatbot.greeting') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await ApiService.chat(user.token, userMessage, historyPayload);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to chat');
      }

      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: 'There was an error reaching the coaching servers. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 pointer-events-auto">
          {/* Header */}
          <div className="bg-blue-600 dark:bg-blue-700 text-white p-4 flex items-center justify-between shadow-sm relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">{t('chatbot.title')}</h3>
                <span className="text-[10px] uppercase font-semibold text-blue-200 tracking-wider">{t('chatbot.subtitle')}</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                }`}>
                  {/* 2. Използваме ReactMarkdown тук */}
                  <div className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                  <ReactMarkdown 
                    components={{
                      // Премахваме {node}, оставяме само {...props}
                      strong: ({ ...props }) => <strong className="font-extrabold text-blue-600 dark:text-blue-400" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc ml-4 my-2 space-y-1" {...props} />,
                      p: ({ ...props }) => <p className="m-0 inline" {...props} />,
                    }}
                  >
                    {msg.content || ''}
                  </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 p-3.5 rounded-2xl rounded-bl-none flex items-center gap-3 text-sm shadow-sm border border-slate-200 dark:border-slate-700">
                  <Loader2 size={16} className="animate-spin text-blue-500" />
                   <span className="font-medium animate-pulse">{t('chatbot.consulting')}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input - Запазваме си твоята логика */}
          {!user ? (
            <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center relative z-10 rounded-b-3xl">
              <p className="text-xs font-semibold text-slate-500 mb-3 tracking-wide uppercase">{t('chatbot.loginPrompt')}</p>
               <Link to="/login" onClick={() => setIsOpen(false)} className="flex justify-center items-center w-full py-3 bg-[#274690] text-white text-sm font-bold rounded-full hover:bg-[#1f3770] transition-colors shadow-md">
                {t('chatbot.signInBtn')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative z-10 rounded-b-3xl">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chatbot.placeholder')}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-full pl-5 pr-14 py-3.5 focus:outline-none focus:ring-0 transition-all text-sm border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-600 font-medium placeholder-slate-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <Send size={16} className="relative left-[1px]" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 active:scale-95 z-50 pointer-events-auto ${
          isOpen ? 'bg-slate-800 dark:bg-slate-700 text-white rotate-90 scale-90' : 'bg-blue-600 dark:bg-blue-500 text-white ring-4 ring-blue-600/20'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default Chatbot;