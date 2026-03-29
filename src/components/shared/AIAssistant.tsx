import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { documentService } from '../../services/documentService';
import type { Document } from '../../types';
import './AIAssistant.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Chào bạn! Tôi là Trợ lý ảo ISO của Phương Nam. Bạn cần tôi hỗ trợ tra cứu quy trình hay tóm tắt văn bản nào không?',
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Tải danh sách tài liệu để làm ngữ cảnh
    const loadDocs = async () => {
      const { data } = await documentService.getDocuments({ pageSize: 100 });
      setDocuments(data);
    };
    loadDocs();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await aiService.askQuestion(input, documents);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          className="ai-floating-btn shadow-glow animate-bounce-subtle"
          onClick={() => setIsOpen(true)}
          title="Hỏi Trợ lý ISO (Gemini AI)"
        >
          <Bot size={28} />
          <span className="pulse-ring"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`ai-chat-window glass-panel shadow-glow-lg ${isMinimized ? 'minimized' : ''} animate-slide-up`}>
          <div className="chat-header text-gradient">
            <div className="flex items-center gap-2">
              <div className="bot-avatar">
                <Bot size={18} />
              </div>
              <div>
                <div className="font-bold text-sm tracking-tight">Trợ lý ISO</div>
                <div className="text-[10px] opacity-70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-hover animate-pulse"></span>
                  Đang trực tuyến (Gemini Pro)
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="icon-btn-sm" onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button className="icon-btn-sm" onClick={() => setIsOpen(false)}>
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="chat-messages custom-scrollbar">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message-wrapper ${msg.role}`}>
                    <div className="message-content shadow-sm">
                      {msg.content}
                      <div className="message-time">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="message-wrapper assistant">
                    <div className="message-content typing shadow-sm">
                      <Loader2 className="animate-spin text-primary" size={16} />
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-area" onSubmit={handleSend}>
                <input 
                  type="text" 
                  placeholder="Gõ câu hỏi về quy trình ISO..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoFocus
                />
                <button type="submit" disabled={!input.trim() || loading} className="send-btn">
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;
