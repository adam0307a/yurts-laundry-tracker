
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Header from '../components/Header';
import BlockSelector from '../components/BlockSelector';
import MachineList from '../components/MachineList';
import MachineDialog from '../components/MachineDialog';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 pb-12">
        <BlockSelector />
        <MachineList />
        <MachineDialog />
      </main>
    </div>
  );
};

export default Dashboard;
