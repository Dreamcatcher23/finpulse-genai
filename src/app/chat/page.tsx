import { PageHeader } from '@/components/page-header';
import { ChatInterface } from './chat-interface';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="AI Chat System"
        description="Engage with our context-aware financial AI assistant."
      />
      <div className="flex-1 mt-4 -m-4 lg:-m-6 p-0">
         <ChatInterface />
      </div>
    </div>
  );
}
