import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { sendChatMessage, ChatMessage } from '@/services/groqService';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const ChatAssistant = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: t('chatAssistant.welcomeMessage')
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Rate limiting: 10 seconds between messages
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime;
    if (timeSinceLastMessage < 10000) {
      const remainingSeconds = Math.ceil((10000 - timeSinceLastMessage) / 1000);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: t('chatAssistant.rateLimitMessage').replace('{seconds}', remainingSeconds.toString())
      }]);
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue('');
    setLastMessageTime(now);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const aiResponse = await sendChatMessage(userMessage, conversationHistory);
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: t('chatAssistant.errorMessage')
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-4 md:bottom-10 md:right-6 z-[100] w-14 h-14 md:w-16 md:h-16 rounded-full bg-luxury-gold hover:bg-luxury-bronze text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          aria-label={t('chatAssistant.openChat')}
        >
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div 
          className={`fixed ${isMobile ? 'inset-0' : 'bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-[380px]'} z-[100] bg-white rounded-2xl shadow-2xl border border-neutral-stone/20 overflow-hidden flex flex-col`}
          style={!isMobile ? { height: '600px', maxHeight: 'calc(100vh - 6rem)' } : { height: '100vh', maxHeight: '100vh' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-luxury-gold to-luxury-bronze p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <h3 className="text-white font-semibold text-lg">{t('chatAssistant.title')}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label={t('chatAssistant.closeChat')}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-neutral-alabaster to-white">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-luxury-gold text-white rounded-br-sm'
                      : 'bg-white text-neutral-charcoal border border-neutral-stone/20 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-stone/20 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <Loader2 className="w-5 h-5 text-luxury-gold animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-neutral-stone/20 p-4 bg-white">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chatAssistant.inputPlaceholder')}
                className="flex-1 px-4 py-3 border border-neutral-stone/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent resize-none text-sm"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-3 bg-luxury-gold hover:bg-luxury-bronze text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t('chatAssistant.sendMessage')}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-neutral-stone mt-2 text-center">
              {t('chatAssistant.inputHint')}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;

