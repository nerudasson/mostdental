import { Outlet } from 'react-router-dom';
import { LanguageToggle } from '@/components/language-toggle';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}