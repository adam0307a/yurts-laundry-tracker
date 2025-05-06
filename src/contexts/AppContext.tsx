import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

export type MachineStatus = 'available' | 'inuse' | 'finishing' | 'nonexistent';
export type MachineType = 'washer' | 'dryer';

export interface Machine {
  id: string;
  name: string;
  block: string;
  status: MachineStatus;
  type: MachineType;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  note?: string;
  user?: string;
}

export interface Block {
  id: string;
  name: string;
}

interface AppContextType {
  username: string;
  setUsername: (name: string) => void;
  isLoggedIn: boolean;
  login: (username: string) => void;
  logout: () => void;
  blocks: Block[];
  machines: Machine[];
  activeMachine?: Machine;
  setActiveMachine: (machine: Machine | undefined) => void;
  selectedBlock: string;
  setSelectedBlock: (blockId: string) => void;
  startMachine: (machine: Machine, hours: number, minutes: number, note?: string) => void;
  endMachine: (machineId: string) => void;
  calculateRemainingTime: (machine: Machine) => number;
  toggleMachineExistence: (machineId: string) => void;
}

const blocks: Block[] = [
  { id: 'a', name: 'A Blok' },
  { id: 'b', name: 'B Blok' },
  { id: 'c', name: 'C Blok' },
  { id: 'd', name: 'D Blok' },
];

// Generate initial machines for each block with 16 washers and 7 dryers
const generateMachines = (): Machine[] => {
  const machines: Machine[] = [];
  blocks.forEach(block => {
    // Add 16 washers per block
    for (let i = 1; i <= 16; i++) {
      machines.push({
        id: `${block.id}-w-${i}`,
        name: `${block.id.toUpperCase()}W${i}`,
        block: block.id,
        status: 'available',
        type: 'washer'
      });
    }
    // Add 7 dryers per block
    for (let i = 1; i <= 7; i++) {
      machines.push({
        id: `${block.id}-d-${i}`,
        name: `${block.id.toUpperCase()}D${i}`,
        block: block.id,
        status: 'available',
        type: 'dryer'
      });
    }
  });
  return machines;
};

const STORAGE_KEY = 'laundry_app_data';

const defaultContext: AppContextType = {
  username: '',
  setUsername: () => {},
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  blocks,
  machines: [],
  activeMachine: undefined,
  setActiveMachine: () => {},
  selectedBlock: 'a',
  setSelectedBlock: () => {},
  startMachine: () => {},
  endMachine: () => {},
  calculateRemainingTime: () => 0,
  toggleMachineExistence: () => {},
};

export const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [activeMachine, setActiveMachine] = useState<Machine | undefined>(undefined);
  const [selectedBlock, setSelectedBlock] = useState('a');

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Convert string dates back to Date objects
        if (parsedData.machines) {
          parsedData.machines = parsedData.machines.map((machine: any) => ({
            ...machine,
            startTime: machine.startTime ? new Date(machine.startTime) : undefined,
            endTime: machine.endTime ? new Date(machine.endTime) : undefined
          }));
          setMachines(parsedData.machines);
        } else {
          // If no machines in saved data, generate them
          setMachines(generateMachines());
        }
        
        if (parsedData.username) {
          setUsername(parsedData.username);
          setIsLoggedIn(true);
        }
        
        if (parsedData.selectedBlock) {
          setSelectedBlock(parsedData.selectedBlock);
        }
      } catch (error) {
        console.error('Failed to parse saved data:', error);
        setMachines(generateMachines());
      }
    } else {
      setMachines(generateMachines());
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (machines.length > 0 || username) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        machines,
        username,
        selectedBlock
      }));
    }
  }, [machines, username, selectedBlock]);

  // Check for machines that are finishing
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedMachines = machines.map(machine => {
        if (machine.status === 'inuse' && machine.endTime) {
          const remainingMinutes = Math.ceil((machine.endTime.getTime() - now.getTime()) / (60 * 1000));
          
          // If less than 5 minutes remaining, set to finishing
          if (remainingMinutes <= 5 && remainingMinutes > 0) {
            return { ...machine, status: 'finishing' as MachineStatus };
          }
          
          // If time is up, set to available and notify
          if (remainingMinutes <= 0) {
            // Only show notifications for your own machines
            if (machine.user === username) {
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
            
            return { 
              ...machine, 
              status: 'available' as MachineStatus,
              startTime: undefined,
              endTime: undefined,
              duration: undefined,
              note: undefined,
              user: undefined
            };
          }
        }
        return machine;
      });
      
      setMachines(updatedMachines);
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [machines, username]);

  // Request notification permission
  useEffect(() => {
    if (isLoggedIn && Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isLoggedIn]);

  const login = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUsername('');
    setIsLoggedIn(false);
    setActiveMachine(undefined);
  };

  const startMachine = (machine: Machine, hours: number, minutes: number, note?: string) => {
    const startTime = new Date();
    const totalMinutes = (hours * 60) + minutes;
    const endTime = new Date(startTime.getTime() + totalMinutes * 60 * 1000);
    
    setMachines(prev => prev.map(m => 
      m.id === machine.id 
        ? { ...m, status: 'inuse' as MachineStatus, startTime, endTime, duration: totalMinutes, note, user: username } 
        : m
    ));
    
    setActiveMachine(undefined);
    
    toast("Çamaşır/kurutma işlemi başladı", {
      description: `${machine.name} makinesi için ${totalMinutes} dakikalık çalışma başladı.`,
    });
  };

  const endMachine = (machineId: string) => {
    setMachines(prev => prev.map(m => 
      m.id === machineId 
        ? { 
            ...m, 
            status: 'available' as MachineStatus,
            startTime: undefined,
            endTime: undefined,
            duration: undefined,
            note: undefined,
            user: undefined
          } 
        : m
    ));
    
    setActiveMachine(undefined);
    
    toast("İşlem sonlandırıldı", {
      description: "Makine kullanıma hazır duruma getirildi.",
    });
  };

  const toggleMachineExistence = (machineId: string) => {
    setMachines(prev => prev.map(m => 
      m.id === machineId 
        ? { 
            ...m, 
            status: m.status === 'nonexistent' ? 'available' : 'nonexistent',
            startTime: undefined,
            endTime: undefined,
            duration: undefined,
            note: undefined,
            user: undefined
          } 
        : m
    ));

    setActiveMachine(undefined);
    
    toast("Makine durumu güncellendi", {
      description: "Makine varlık durumu güncellendi.",
    });
  };

  const calculateRemainingTime = (machine: Machine): number => {
    if (machine.status !== 'inuse' && machine.status !== 'finishing' || !machine.endTime) {
      return 0;
    }
    
    const now = new Date();
    const remainingMillis = machine.endTime.getTime() - now.getTime();
    return Math.max(0, Math.ceil(remainingMillis / (60 * 1000)));
  };

  return (
    <AppContext.Provider value={{
      username,
      setUsername,
      isLoggedIn,
      login,
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
      toggleMachineExistence
    }}>
      {children}
    </AppContext.Provider>
  );
};
