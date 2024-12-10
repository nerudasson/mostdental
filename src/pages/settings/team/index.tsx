import { useAuth } from '@/hooks/use-auth';
import { DentistTeamSettings } from './dentist-team';
import { LabTeamSettings } from './lab-team';

export function TeamSettingsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === 'dentist' ? <DentistTeamSettings /> : <LabTeamSettings />;
}