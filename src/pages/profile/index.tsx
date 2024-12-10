import { useTranslation } from 'react-i18next';

export function ProfilePage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold">{t('nav.profile')}</h1>
    </div>
  );
}