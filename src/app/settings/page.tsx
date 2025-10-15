import { PageHeader } from '@/components/page-header';
import { SettingsForm } from './settings-form';

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Personalized User Dashboard"
        description="Manage your profile, preferences, and AI interactions."
      />
      <div className="mt-4">
        <SettingsForm />
      </div>
    </div>
  );
}
