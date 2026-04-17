import React from 'react';
import { Send, Image, Paperclip, MoreVertical, Search, Phone, Video, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function ChatUI() {
  const [selectedChat, setSelectedChat] = React.useState(0);

  const chats = [
    { id: 1, name: 'شركة الأمل للبناء', lastMsg: 'نحتاج عرض سعر لـ 50 وحدة...', time: '10:30 ص', unread: 2, online: true },
    { id: 2, name: 'المورد: معدات الجزائر', lastMsg: 'تم تحديث حالة الشحنة الخاصة بك', time: 'أمس', unread: 0, online: false },
    { id: 3, name: 'إدارة Businfo', lastMsg: 'تم قبول طلب الشارة الخاص بك', time: '2 مارس', unread: 0, online: true },
  ];

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
           {chats.map((chat, i) => (
             <div 
              key={chat.id} 
              onClick={() => setSelectedChat(i)}
              className={cn(
                "p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors border-b last:border-0",
                selectedChat === i && "bg-muted shadow-inner"
              )}
             >
                <div className="relative">
                   <Avatar className="h-12 w-12 border">
                      <AvatarImage src={`https://picsum.photos/seed/${chat.id}/100/100`} />
                      <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                   </Avatar>
                   {chat.online && <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-sm truncate">{chat.name}</p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{chat.time}</span>
                   </div>
                   <p className="text-xs text-muted-foreground truncate">{chat.lastMsg}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="h-5 w-5 bg-secondary text-primary font-black text-[10px] rounded-full flex items-center justify-center">
                    {chat.unread}
                  </div>
                )}
             </div>
           ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-muted/10">
         {/* Chat Header */}
         <header className="h-20 bg-white border-b px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Avatar className="h-10 w-10 border">
                  <AvatarImage src={`https://picsum.photos/seed/${chats[selectedChat].id}/100/100`} />
                  <AvatarFallback>{chats[selectedChat].name.charAt(0)}</AvatarFallback>
               </Avatar>
               <div>
                  <p className="font-bold text-sm leading-none mb-1">{chats[selectedChat].name}</p>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">متصل الآن</p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" className="text-muted-foreground"><Phone className="h-5 w-5" /></Button>
               <Button variant="ghost" size="icon" className="text-muted-foreground"><Video className="h-5 w-5" /></Button>
               <Button variant="ghost" size="icon" className="text-muted-foreground"><Info className="h-5 w-5" /></Button>
               <Button variant="ghost" size="icon" className="text-muted-foreground"><MoreVertical className="h-5 w-5" /></Button>
            </div>
         </header>

         {/* Messages */}
         <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex justify-center">
              <span className="bg-white/80 rounded-full px-4 py-1 text-[10px] font-bold text-muted-foreground border uppercase tracking-widest">اليوم</span>
            </div>

            <Message bubble="أهلاً بك، هل تتوفر لديكم آلة الطحن موديل X200 في المخزون حالياً؟" time="10:15 ص" isSender={false} />
            <Message bubble="أهلاً بك سيد كريم. نعم، تتوفر حالياً 5 وحدات في مستودعنا بالجزائر العاصمة." time="10:17 ص" isSender={true} />
            <Message bubble="ممتاز، هل يمكنكم تزويدي بعرض سعر شامل للتوصيل إلى وهران لـ 3 وحدات؟" time="10:20 ص" isSender={false} />
            <Message bubble="بكل سرور. سأقوم بإعداد عرض السعر وإرساله لك عبر المنصة خلال دقائق." time="10:22 ص" isSender={true} />
         </div>

         {/* Input */}
         <div className="p-6 bg-white border-t">
            <div className="flex items-center gap-4 bg-muted/30 rounded-2xl p-2 pl-4">
               <div className="flex gap-2">
                 <Button variant="ghost" size="icon" className="text-muted-foreground"><Paperclip className="h-5 w-5" /></Button>
                 <Button variant="ghost" size="icon" className="text-muted-foreground"><Image className="h-5 w-5" /></Button>
               </div>
               <input 
                type="text" 
                placeholder="اكتب رسالتك هنا..." 
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2" 
               />
               <Button size="icon" className="rounded-xl bg-primary hover:bg-secondary hover:text-primary transition-all shadow-lg">
                 <Send className="h-4 w-4" />
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}

function Message({ bubble, time, isSender }: { bubble: string, time: string, isSender: boolean }) {
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
