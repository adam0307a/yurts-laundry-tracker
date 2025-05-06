
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Login from '../components/Login';
import Dashboard from './Dashboard';

const Index = () => {
  const { isLoggedIn } = useAppContext();
  
  return isLoggedIn ? <Dashboard /> : <Login />;
};

export default Index;
