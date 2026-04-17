import { ChatUI } from '@/components/features/ChatUI';

export function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl font-black text-primary uppercase">مركز الرسائل MESSAGES</h1>
          <p className="text-muted-foreground text-sm">تواصل مباشرة مع المشترين والموردين وأدمن المنصة.</p>
        </div>
      </div>
      <ChatUI />
    </div>
  );
}
