import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import socketService from '../services/socket';
import { Send, ArrowLeft, Loader2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Smart merge: add only genuinely new messages, never reorder existing ones
const mergeMessages = (existing, incoming) => {
  const existingIds = new Set(existing.map(m => m.id));
  const newOnes = incoming.filter(m => !existingIds.has(m.id));
  if (newOnes.length === 0) return existing; // Nothing new — no re-render
  return [...existing, ...newOnes];
};

const ChatRoom = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Store current user ID in a ref so callbacks always have latest value
  const myUserID = user?.id;

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  // Initial full load — only called once on mount
  const loadInitialMessages = useCallback(async () => {
    try {
      const res = await api.get(`/chats/${id}/messages`);
      const fetched = res.data.data || []; // Backend already returns oldest-first
      setMessages(fetched);
      setTimeout(() => scrollToBottom(false), 100);
    } catch (err) {
      console.error('[Chat] Failed to load initial messages:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Poll for new messages — SMART MERGE only, never replaces full list
  const pollNewMessages = useCallback(async () => {
    try {
      const res = await api.get(`/chats/${id}/messages`);
      const fetched = res.data.data || []; // Backend already returns oldest-first
      setMessages(prev => {
        const merged = mergeMessages(prev, fetched);
        if (merged.length > prev.length) {
          // New messages arrived — scroll to bottom
          setTimeout(() => scrollToBottom(true), 50);
        }
        return merged;
      });
    } catch (err) {
      // Silent fail on poll
    }
  }, [id]);

  useEffect(() => {
    loadInitialMessages();

    // WebSocket — real-time push for incoming messages
    const token = localStorage.getItem('token');
    socketService.connect(token, (wsMsg) => {
      if (wsMsg.type === 'new_message' && wsMsg.chat_id === id && wsMsg.message) {
        setMessages(prev => {
          const merged = mergeMessages(prev, [wsMsg.message]);
          if (merged.length > prev.length) {
            setTimeout(() => scrollToBottom(true), 50);
          }
          return merged;
        });
      }
    });

    // Polling fallback every 3 seconds (catches messages if WS fails)
    const poll = setInterval(pollNewMessages, 3000);

    return () => {
      clearInterval(poll);
      socketService.disconnect();
    };
  }, [id, loadInitialMessages, pollNewMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || sending) return;

    const content = inputValue.trim();
    setInputValue('');
    setSending(true);

    try {
      const res = await api.post(`/chats/${id}/messages`, { content });
      const sentMsg = res.data.data;
      if (sentMsg) {
        // Optimistically append — smart merge prevents duplicates when poll also catches it
        setMessages(prev => mergeMessages(prev, [sentMsg]));
        setTimeout(() => scrollToBottom(true), 50);
      }
    } catch (err) {
      console.error('[Chat] Failed to send message:', err);
      // Restore the message so user can retry
      setInputValue(content);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
      {/* Header */}
      <header className="flex items-center gap-4 py-4 border-b border-slate-100 bg-white sticky top-0 z-10 -mx-6 px-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-500">
            <User size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 leading-tight">Chat Room</h2>
            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
              Online
            </p>
          </div>
        </div>
      </header>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto py-6 space-y-3 pr-1">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
            No messages yet. Say hello! 👋
          </div>
        )}

        {messages.map((msg, idx) => {
          // Determine if this message was sent by the current user
          const isMe = String(msg.sender_id) === String(myUserID);

          // Group consecutive messages from same sender
          const prevMsg = messages[idx - 1];
          const isSameSenderAsPrev = prevMsg && prevMsg.sender_id === msg.sender_id;

          return (
            <motion.div
              key={msg.id || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isSameSenderAsPrev ? 'mt-1' : 'mt-4'}`}
            >
              {/* Avatar for other user — only show on first message in group */}
              {!isMe && !isSameSenderAsPrev && (
                <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mr-2 mt-1 flex-shrink-0">
                  <User size={14} />
                </div>
              )}
              {/* Spacer to align grouped messages with avatar */}
              {!isMe && isSameSenderAsPrev && (
                <div className="w-7 mr-2 flex-shrink-0" />
              )}

              <div className={`max-w-[75%] px-4 py-2.5 text-sm font-medium shadow-sm ${
                isMe
                  ? 'bg-primary-500 text-white rounded-2xl rounded-br-sm'
                  : 'bg-white text-slate-800 rounded-2xl rounded-bl-sm border border-slate-100'
              }`}>
                {msg.content}
                <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-200 text-right' : 'text-slate-400'}`}>
                  {msg.created_at
                    ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'now'}
                </p>
              </div>
            </motion.div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-3 border-t border-slate-100 bg-white -mx-6 px-6 pb-3">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:border-primary-500 focus:bg-white transition-all text-sm font-medium"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || sending}
            className="p-3.5 bg-primary-500 text-white rounded-2xl shadow-lg shadow-primary-500/20 hover:bg-primary-600 disabled:opacity-40 disabled:shadow-none transition-all active:scale-95 flex-shrink-0"
          >
            {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} fill="currentColor" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
