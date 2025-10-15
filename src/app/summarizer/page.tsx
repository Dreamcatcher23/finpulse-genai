import { PageHeader } from '@/components/page-header';
import { SummarizerClient } from './summarizer-client';

export default function SummarizerPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Content Summarization Engine"
        description="Summarize articles into brief, detailed, or actionable formats."
      />
      <div className="mt-4 flex-1">
        <SummarizerClient />
      </div>
    </div>
  );
}
