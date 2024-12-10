import { useTranslation } from 'react-i18next';
import { LogoUpload } from '@/components/settings/logo-upload';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export function ProfileSettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated.',
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.profile')}</h1>
      
      <LogoUpload />
      
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Profile Information</h3>
            <p className="text-sm text-muted-foreground">
              Update your personal information and preferences.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input defaultValue={user?.name} />
            </div>

            <div className="grid gap-2">
              <Label>Email</Label>
              <Input type="email" defaultValue={user?.email} />
            </div>

            {user?.role === 'dentist' ? (
              <div className="grid gap-2">
                <Label>Practice Name</Label>
                <Input defaultValue={user?.practice} />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label>Lab Name</Label>
                <Input defaultValue={user?.labName} />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}