
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { WashingMachine, Check, X, Loader } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

const MachineList: React.FC = () => {
  const { machines, selectedBlock, setActiveMachine, calculateRemainingTime } = useAppContext();
  
  const blockMachines = machines.filter(machine => machine.block === selectedBlock);
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'available':
        return <Check className="h-4 w-4 text-status-available" />;
      case 'inuse':
        return <X className="h-4 w-4 text-status-inuse" />;
      case 'finishing':
        return <Loader className="h-4 w-4 text-status-finishing animate-spin" />;
      default:
        return null;
    }
  };
  
  const formatTime = (date?: Date) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {blockMachines.map((machine) => {
        const remainingTime = calculateRemainingTime(machine);
        
        return (
          <Card 
            key={machine.id}
            className={cn(
              "overflow-hidden transition-colors",
              machine.status === 'available' ? 'border-status-available/30' : 
              machine.status === 'finishing' ? 'border-status-finishing/30' : 
              'border-status-inuse/30'
            )}
          >
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <WashingMachine className="h-6 w-6 mr-2 text-gray-600" />
                  <h3 className="font-medium text-lg">{machine.name}</h3>
                </div>
                <div className="flex items-center">
                  <span className={cn(
                    "text-sm px-2 py-1 rounded-full",
                    machine.status === 'available' ? 'bg-status-available/10 text-status-available' : 
                    machine.status === 'finishing' ? 'bg-status-finishing/10 text-status-finishing animate-pulse' : 
                    'bg-status-inuse/10 text-status-inuse'
                  )}>
                    {getStatusIcon(machine.status)}
                    {machine.status === 'available' ? 'Boş' : 
                     machine.status === 'finishing' ? 'Bitmek Üzere' : 
                     'Kullanımda'}
                  </span>
                </div>
              </div>
              
              {machine.status !== 'available' && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Başlangıç</p>
                      <p>{formatTime(machine.startTime)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Bitiş</p>
                      <p>{formatTime(machine.endTime)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Kalan Süre</p>
                      <p>{remainingTime} dakika</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Kullanıcı</p>
                      <p>{machine.user || '--'}</p>
                    </div>
                  </div>
                  
                  {machine.note && (
                    <div className="mt-2 text-sm">
                      <p className="text-gray-500">Not</p>
                      <p className="italic">{machine.note}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-4 bg-white dark:bg-gray-950 border-t">
                <Button 
                  variant={machine.status === 'available' ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => setActiveMachine(machine)}
                >
                  {machine.status === 'available' ? 'Kullan' : 'Detaylar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MachineList;
