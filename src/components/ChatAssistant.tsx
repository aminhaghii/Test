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
          className="fixed bottom-6 right-4 md:bottom-10 md:right-8 z-[100] inline-flex h-12 w-12 items-center justify-center rounded-[14px] border border-neutral-stone/50 bg-white/70 text-neutral-charcoal shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-neutral-charcoal/60 hover:bg-white/90"
          aria-label={t('chatAssistant.openChat')}
        >
          <MessageCircle className="h-[22px] w-[22px]" strokeWidth={1.75} />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`fixed ${isMobile ? 'inset-0' : 'bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-[360px]'} z-[100] flex flex-col overflow-hidden rounded-[20px] border border-neutral-stone/40 bg-white/95 text-neutral-charcoal shadow-2xl backdrop-blur`}
          style={!isMobile ? { height: '560px', maxHeight: 'calc(100vh - 6rem)' } : { height: '100vh', maxHeight: '100vh' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-stone/30 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-neutral-stone/40 bg-neutral-alabaster/90">
                <div className="absolute inset-0 flex items-center justify-center text-neutral-charcoal">
                  <MessageCircle className="h-4 w-4" strokeWidth={1.6} />
                </div>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-wide uppercase text-neutral-stone/80">
                  {t('chatAssistant.title')}
                </span>
                <span className="text-xs text-neutral-slate">
                  {t('chatAssistant.inputPlaceholder')}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-neutral-slate transition-all duration-150 hover:border-neutral-stone/40 hover:text-neutral-charcoal"
              aria-label={t('chatAssistant.closeChat')}
            >
              <X className="h-4 w-4" strokeWidth={1.6} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 sm:space-y-4 overflow-y-auto bg-neutral-alabaster/40 px-3 sm:px-4 md:px-5 py-3 sm:py-4 -webkit-overflow-scrolling-touch">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-[14px] sm:rounded-[18px] px-3 sm:px-4 py-2 sm:py-3 ${
                    msg.role === 'user'
                      ? 'bg-neutral-charcoal text-white/90 rounded-br-sm'
                      : 'border border-neutral-stone/40 bg-white/95 text-neutral-charcoal rounded-bl-sm'
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-[18px] border border-neutral-stone/40 bg-white/95 px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-neutral-charcoal" strokeWidth={1.7} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-neutral-stone/30 bg-white/95 p-3 sm:p-4">
            <div className="flex items-end gap-2 sm:gap-3">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chatAssistant.inputPlaceholder')}
                className="flex-1 resize-none rounded-[14px] sm:rounded-[16px] border border-neutral-stone/40 bg-white/80 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-neutral-charcoal shadow-inner outline-none transition focus:border-neutral-charcoal/40 focus:bg-white focus:shadow-none touch-manipulation"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px', fontSize: '16px' }}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[10px] sm:rounded-[12px] border border-neutral-stone/40 bg-white/80 text-neutral-charcoal transition-all duration-150 hover:-translate-y-[2px] hover:border-neutral-charcoal/50 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation"
                aria-label={t('chatAssistant.sendMessage')}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                ) : (
                  <Send className="h-4 w-4" strokeWidth={1.6} />
                )}
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] uppercase tracking-[0.25em] text-neutral-stone/70">
              {t('chatAssistant.inputHint')}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;

