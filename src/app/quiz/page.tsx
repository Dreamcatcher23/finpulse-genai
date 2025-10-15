import { PageHeader } from '@/components/page-header';
import { QuizClient } from './quiz-client';

export default function QuizPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Gamified Financial Quizzes"
        description="Test your financial knowledge and earn rewards."
      />
      <div className="mt-4">
        <QuizClient />
      </div>
    </div>
  );
}
