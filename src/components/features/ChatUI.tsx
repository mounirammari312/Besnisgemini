import React from 'react';
import { Send, Image, Paperclip, MoreVertical, Search, Phone, Video, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export function ChatUI() {
  const { session, user } = useAuth();
  const [selectedChat, setSelectedChat] = React.useState<any>(null);
  const [chats, setChats] = React.useState<any[]>([]);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('/api/me/chats', {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        const data = await res.json();
        setChats(data);
        if (data.length > 0) setSelectedChat(data[0]);
      } catch (e) {
        console.error('Error fetching chats');
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchChats();
  }, [session]);

  const fetchMessages = async (chatId: string) => {
    try {
      const res = await fetch(`/api/messages/${chatId}`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      const data = await res.json();
      setMessages(data);
    } catch (e) {
      console.error('Error fetching messages');
    }
  };

  React.useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat, session]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}` 
        },
        body: JSON.stringify({ chat_id: selectedChat.id, content: newMessage })
      });
      if (res.ok) {
        setNewMessage('');
        fetchMessages(selectedChat.id);
      }
    } catch (e) {
      console.error('Error sending message');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="bg-white rounded-3xl border shadow-lg overflow-hidden flex h-[700px]">
      {/* Sidebar */}
      <aside className="w-80 border-l flex flex-col">
        <div className="p-6 border-b space-y-4">
          <h2 className="font-heading text-xl font-bold text-primary">المراسلات</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="بحث في المحادثات..." className="pl-10 rounded-full h-10" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
           {chats.map((chat) => {
             const partner = chat.buyer_id === user?.id ? chat.suppliers : chat.profiles;
             const partnerName = partner?.company_name || partner?.display_name || partner?.name || 'User';
             return (
               <div 
                key={chat.id} 
                onClick={() => setSelectedChat(chat)}
                className={cn(
                  "p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors border-b last:border-0",
                  selectedChat?.id === chat.id && "bg-muted shadow-inner"
                )}
               >
                  <div className="relative">
                     <Avatar className="h-12 w-12 border">
                        <AvatarImage src={partner?.photo_url || `https://picsum.photos/seed/${chat.id}/100/100`} />
                        <AvatarFallback>{partnerName.charAt(0)}</AvatarFallback>
                     </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-center mb-1">
                        <p className="font-bold text-sm truncate">{partnerName}</p>
                     </div>
                     <p className="text-xs text-muted-foreground truncate">{chat.last_message}</p>
                  </div>
               </div>
             );
           })}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-muted/10">
         {selectedChat ? (
           <>
             {/* Chat Header */}
             <header className="h-20 bg-white border-b px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <Avatar className="h-10 w-10 border">
                      <AvatarImage src={`https://picsum.photos/seed/${selectedChat.id}/100/100`} />
                      <AvatarFallback>?</AvatarFallback>
                   </Avatar>
                   <div>
                      <p className="font-bold text-sm leading-none mb-1">
                        {selectedChat.buyer_id === user?.id 
                          ? (selectedChat.suppliers?.company_name || selectedChat.suppliers?.name) 
                          : (selectedChat.profiles?.display_name)}
                      </p>
                      <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">متصل الآن</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="icon" className="text-muted-foreground"><Phone className="h-5 w-5" /></Button>
                   <Button variant="ghost" size="icon" className="text-muted-foreground"><Video className="h-5 w-5" /></Button>
                   <Button variant="ghost" size="icon" className="text-muted-foreground"><MoreVertical className="h-5 w-5" /></Button>
                </div>
             </header>

             {/* Messages */}
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m) => (
                  <Message 
                    key={m.id} 
                    bubble={m.content} 
                    time={new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                    isSender={m.sender_id === user?.id} 
                  />
                ))}
             </div>

             {/* Input */}
             <div className="p-6 bg-white border-t">
                <div className="flex items-center gap-4 bg-muted/30 rounded-2xl p-2 pl-4">
                   <div className="flex gap-2">
                     <Button variant="ghost" size="icon" className="text-muted-foreground"><Paperclip className="h-5 w-5" /></Button>
                   </div>
                   <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="اكتب رسالتك هنا..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2" 
                   />
                   <Button 
                    onClick={handleSendMessage}
                    size="icon" 
                    className="rounded-xl bg-primary hover:bg-secondary hover:text-primary transition-all shadow-lg"
                   >
                     <Send className="h-4 w-4" />
                   </Button>
                </div>
             </div>
           </>
         ) : (
           <div className="flex-1 flex items-center justify-center text-muted-foreground italic">
              اختر محادثة للبدء
           </div>
         )}
      </div>
    </div>
  );
}

function Message({ bubble, time, isSender }: { bubble: string, time: string, isSender: boolean, key?: any }) {
  return (
    <div className={cn("flex max-w-[80%]", isSender ? "mr-auto flex-row-reverse" : "ml-auto")}>
       <div className={cn(
         "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
         isSender ? "bg-primary text-white rounded-tl-none" : "bg-white text-primary rounded-tr-none border"
       )}>
          {bubble}
          <p className={cn("text-[9px] mt-2 block opacity-50 font-bold font-sans text-left", isSender ? "text-white" : "text-primary")}>
            {time}
          </p>
       </div>
    </div>
  );
}
