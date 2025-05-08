
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Login from '../components/Login';
import Dashboard from './Dashboard';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { isLoggedIn, loading, loadingError } = useAppContext();
  
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Yükleniyor...</span>
      </div>
    );
  }
  
  if (loadingError) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">Bir hata oluştu. Lütfen tekrar deneyin.</div>
        <div className="text-sm text-gray-500">{loadingError}</div>
      </div>
    );
  }
  
  return isLoggedIn ? <Dashboard /> : <Login />;
};

export default Index;
