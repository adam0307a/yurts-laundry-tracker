
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Button } from '@/components/ui/button';
import { WashingMachine } from 'lucide-react';

const Header: React.FC = () => {
  const { username, logout } = useAppContext();
  
  return (
    <header className="bg-white dark:bg-gray-950 border-b mb-6">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <WashingMachine className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-lg font-bold">KYK Çamaşırhane Takip</h1>
        </div>
        
        <div className="flex items-center">
          <span className="mr-4 text-sm text-gray-600 dark:text-gray-400 hidden sm:inline-block">
            Merhaba, {username}
          </span>
          <Button variant="outline" size="sm" onClick={logout}>
            Çıkış Yap
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
