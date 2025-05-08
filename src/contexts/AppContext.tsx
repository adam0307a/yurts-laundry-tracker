
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";
import { supabase, getCurrentUser, getSession, signOut } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export type MachineStatus = 'available' | 'inuse' | 'finishing' | 'nonexistent';
export type MachineType = 'washer' | 'dryer';

export interface Machine {
  id: string;
  name: string;
  block: string;
  status: MachineStatus;
  type: MachineType;
  start_time?: string;
  end_time?: string;
  duration?: number;
  note?: string;
  user_id?: string;
  user_email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Block {
  id: string;
  name: string;
}

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  blocks: Block[];
  machines: Machine[];
  activeMachine?: Machine;
  setActiveMachine: (machine: Machine | undefined) => void;
  selectedBlock: string;
  setSelectedBlock: (blockId: string) => void;
  startMachine: (machine: Machine, hours: number, minutes: number, note?: string) => Promise<void>;
  endMachine: (machineId: string) => Promise<void>;
  calculateRemainingTime: (machine: Machine) => number;
  toggleMachineExistence: (machineId: string) => Promise<void>;
  loading: boolean;
}

const blocks: Block[] = [
  { id: 'a', name: 'A Blok' },
  { id: 'b', name: 'B Blok' },
  { id: 'c', name: 'C Blok' },
  { id: 'd', name: 'D Blok' },
];

const defaultContext: AppContextType = {
  user: null,
  isLoggedIn: false,
  logout: async () => {},
  blocks,
  machines: [],
  activeMachine: undefined,
  setActiveMachine: () => {},
  selectedBlock: 'a',
  setSelectedBlock: () => {},
  startMachine: async () => {},
  endMachine: async () => {},
  calculateRemainingTime: () => 0,
  toggleMachineExistence: async () => {},
  loading: true,
};

export const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [activeMachine, setActiveMachine] = useState<Machine | undefined>(undefined);
  const [selectedBlock, setSelectedBlock] = useState('a');
  const [loading, setLoading] = useState(true);

  // Initialize auth state from Supabase
  useEffect(() => {
    const initAuth = async () => {
      const { session } = await getSession();
      if (session) {
        const { user: currentUser } = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsLoggedIn(true);
        }
      }
      setLoading(false);
    };

    initAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          const { user: currentUser } = await getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsLoggedIn(true);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoggedIn(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch machines from Supabase
  useEffect(() => {
    const fetchMachines = async () => {
      if (!isLoggedIn) return;
      
      try {
        const { data, error } = await supabase
          .from('machines')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching machines:', error);
          toast.error('Makineleri yüklerken bir hata oluştu.');
          return;
        }
        
        if (data) {
          setMachines(data);
        }
      } catch (error) {
        console.error('Error in fetchMachines:', error);
        toast.error('Makineleri yüklerken bir hata oluştu.');
      }
    };

    fetchMachines();
    
    // Set up real-time subscription for machines
    const machinesSubscription = supabase
      .channel('machines-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'machines' 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMachines(prev => [...prev, payload.new as Machine]);
        } else if (payload.eventType === 'UPDATE') {
          setMachines(prev => prev.map(m => 
            m.id === payload.new.id ? { ...payload.new as Machine } : m
          ));
        } else if (payload.eventType === 'DELETE') {
          setMachines(prev => prev.filter(m => m.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(machinesSubscription);
    };
  }, [isLoggedIn]);

  // Check for machines that are finishing
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedMachines = machines.map(machine => {
        if (machine.status === 'inuse' && machine.end_time) {
          const endTime = new Date(machine.end_time);
          const remainingMinutes = Math.ceil((endTime.getTime() - now.getTime()) / (60 * 1000));
          
          // If less than 5 minutes remaining, set to finishing
          if (remainingMinutes <= 5 && remainingMinutes > 0) {
            return { ...machine, status: 'finishing' as MachineStatus };
          }
          
          // If time is up, notify but don't update status
          // Status update will come from the database via subscription
          if (remainingMinutes <= 0) {
            // Only show notifications for your own machines
            if (machine.user_id === user?.id) {
              toast("Çamaşır/kurutma işlemi tamamlandı!", {
                description: `${machine.name} makinesindeki işlem tamamlandı.`,
                duration: 5000,
              });
              
              // Try to use browser notifications if allowed
              if (Notification && Notification.permission === 'granted') {
                new Notification('Çamaşır/kurutma işlemi tamamlandı!', {
                  body: `${machine.name} makinesindeki işlem tamamlandı.`
                });
              }
            }
          }
        }
        return machine;
      });
      
      setMachines(updatedMachines);
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [machines, user?.id]);

  // Request notification permission
  useEffect(() => {
    if (isLoggedIn && Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isLoggedIn]);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    setActiveMachine(undefined);
    toast.info('Çıkış yapıldı');
  };

  const startMachine = async (machine: Machine, hours: number, minutes: number, note?: string) => {
    if (!user) {
      toast.error('Bu işlem için giriş yapmanız gerekiyor.');
      return;
    }
    
    try {
      const startTime = new Date();
      const totalMinutes = (hours * 60) + minutes;
      const endTime = new Date(startTime.getTime() + totalMinutes * 60 * 1000);
      
      const { error } = await supabase
        .from('machines')
        .update({
          status: 'inuse',
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration: totalMinutes,
          note: note || null,
          user_id: user.id,
          user_email: user.email
        })
        .eq('id', machine.id);
      
      if (error) {
        throw error;
      }
      
      setActiveMachine(undefined);
      
      toast("Çamaşır/kurutma işlemi başladı", {
        description: `${machine.name} makinesi için ${totalMinutes} dakikalık çalışma başladı.`,
      });
    } catch (error) {
      console.error('Error starting machine:', error);
      toast.error('Makineyi başlatırken bir hata oluştu.');
    }
  };

  const endMachine = async (machineId: string) => {
    if (!user) {
      toast.error('Bu işlem için giriş yapmanız gerekiyor.');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('machines')
        .update({
          status: 'available',
          start_time: null,
          end_time: null,
          duration: null,
          note: null,
          user_id: null,
          user_email: null
        })
        .eq('id', machineId)
        .eq('user_id', user.id); // Only the user who started can end
      
      if (error) {
        throw error;
      }
      
      setActiveMachine(undefined);
      
      toast("İşlem sonlandırıldı", {
        description: "Makine kullanıma hazır duruma getirildi.",
      });
    } catch (error) {
      console.error('Error ending machine:', error);
      toast.error('Makineyi sonlandırırken bir hata oluştu.');
    }
  };

  const toggleMachineExistence = async (machineId: string) => {
    if (!user) {
      toast.error('Bu işlem için giriş yapmanız gerekiyor.');
      return;
    }
    
    try {
      const machine = machines.find(m => m.id === machineId);
      if (!machine) return;
      
      const newStatus = machine.status === 'nonexistent' ? 'available' : 'nonexistent';
      
      const { error } = await supabase
        .from('machines')
        .update({
          status: newStatus,
          start_time: null,
          end_time: null,
          duration: null,
          note: null,
          user_id: null,
          user_email: null
        })
        .eq('id', machineId);
      
      if (error) {
        throw error;
      }
      
      setActiveMachine(undefined);
      
      toast("Makine durumu güncellendi", {
        description: "Makine varlık durumu güncellendi.",
      });
    } catch (error) {
      console.error('Error toggling machine existence:', error);
      toast.error('Makine durumunu güncellerken bir hata oluştu.');
    }
  };

  const calculateRemainingTime = (machine: Machine): number => {
    if (machine.status !== 'inuse' && machine.status !== 'finishing' || !machine.end_time) {
      return 0;
    }
    
    const now = new Date();
    const endTime = new Date(machine.end_time);
    const remainingMillis = endTime.getTime() - now.getTime();
    return Math.max(0, Math.ceil(remainingMillis / (60 * 1000)));
  };

  return (
    <AppContext.Provider value={{
      user,
      isLoggedIn,
      logout,
      blocks,
      machines,
      activeMachine,
      setActiveMachine,
      selectedBlock,
      setSelectedBlock,
      startMachine,
      endMachine,
      calculateRemainingTime,
      toggleMachineExistence,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};
