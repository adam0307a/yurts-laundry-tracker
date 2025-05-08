
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Login from '../components/Login';
import Dashboard from './Dashboard';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { isLoggedIn, loading } = useAppContext();
  
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Yükleniyor...</span>
      </div>
    );
  }
  
  return isLoggedIn ? <Dashboard /> : <Login />;
};

export default Index;
