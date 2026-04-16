import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MessageCircle, Loader2, ArrowRight, User } from 'lucide-react';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get('/chats');
        setChats(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900">Messages</h1>
        <p className="text-slate-500 font-medium">Continue your divine conversations</p>
      </header>

      <div className="space-y-3">
        {chats.length > 0 ? (
          chats.map((summary) => (
            <button
              key={summary.chat.id}
              onClick={() => navigate(`/chats/${summary.chat.id}`)}
              className="card w-full p-4 flex items-center justify-between hover:border-primary-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-50 relative">
                  <User size={28} />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {summary.other_user?.name || "Church Member"}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-1">
                    {summary.last_message?.content || "No messages yet... Start the talk!"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-400 capitalize">
                       {summary.other_user?.church}
                    </p>
                    {summary.last_message && (
                      <p className="text-[10px] text-slate-300">
                        {new Date(summary.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                 </div>
                 <div className="p-2 bg-slate-50 text-slate-300 rounded-lg group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                   <ArrowRight size={18} />
                 </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-24 card border-dashed bg-transparent">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
               <MessageCircle size={32} />
             </div>
             <p className="text-slate-400 font-bold">No chats yet.</p>
             <p className="text-sm text-slate-300">Matches you accept will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
