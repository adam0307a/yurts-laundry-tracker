
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Header from '../components/Header';
import BlockSelector from '../components/BlockSelector';
import MachineList from '../components/MachineList';
import MachineDialog from '../components/MachineDialog';
import { Toaster } from "@/components/ui/toaster";

const Dashboard: React.FC = () => {
  const { user } = useAppContext();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 pb-12">
        <div className="my-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h1 className="text-xl font-bold mb-2">KYK Çamaşırhane Takip Sistemi</h1>
          <p className="text-muted-foreground">
            Hoş geldin {user?.user_metadata?.full_name || user?.email}! Çamaşır ve kurutma makinelerinin durumunu takip edebilir, boş makineleri kullanabilirsin. 
            Makinenin işlemi tamamlandığında bildirim alacaksın.
          </p>
        </div>
        
        <BlockSelector />
        <MachineList />
        <MachineDialog />
      </main>
      <Toaster />
    </div>
  );
};

export default Dashboard;
