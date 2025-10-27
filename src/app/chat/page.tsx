import { PageHeader } from '@/components/page-header';
import { ChatInterface } from './chat-interface';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="AI Chat System"
        description="Engage with our context-aware financial AI assistant."
      />
      <div className="flex-1 mt-4">
         <ChatInterface />
      </div>
    </div>
  );
}
