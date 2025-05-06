
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { WashingMachine, Power, Timer, Clock } from 'lucide-react';

const durations = [
  { value: 30, label: '30 dakika' },
  { value: 45, label: '45 dakika' },
  { value: 60, label: '60 dakika' },
  { value: 90, label: '90 dakika' },
  { value: 120, label: '120 dakika' },
];

const MachineDialog: React.FC = () => {
  const { 
    activeMachine, 
    setActiveMachine, 
    startMachine, 
    endMachine,
    calculateRemainingTime,
    username
  } = useAppContext();
  
  const [duration, setDuration] = useState<string>('45');
  const [note, setNote] = useState<string>('');
  
  const isOwner = activeMachine?.user === username;
  const remainingTime = activeMachine ? calculateRemainingTime(activeMachine) : 0;
  
  useEffect(() => {
    if (activeMachine) {
      setDuration(activeMachine.duration?.toString() || '45');
      setNote(activeMachine.note || '');
    }
  }, [activeMachine]);
  
  const handleStartMachine = () => {
    if (activeMachine) {
      startMachine(activeMachine, parseInt(duration), note);
    }
  };
  
  const handleEndMachine = () => {
    if (activeMachine) {
      endMachine(activeMachine.id);
      setActiveMachine(undefined);
    }
  };
  
  const formatTime = (date?: Date) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Dialog open={!!activeMachine} onOpenChange={(open) => !open && setActiveMachine(undefined)}>
      <DialogContent className="sm:max-w-[425px]">
        {activeMachine && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <WashingMachine className="h-6 w-6 text-primary" />
                <DialogTitle>{activeMachine.name} Makinesi</DialogTitle>
              </div>
              <DialogDescription>
                {activeMachine.status === 'available' 
                  ? 'Bu makineyi kullanmak için detayları girin'
                  : `Durum: ${activeMachine.status === 'finishing' ? 'Bitmek Üzere' : 'Kullanımda'}`
                }
              </DialogDescription>
            </DialogHeader>
            
            {activeMachine.status === 'available' ? (
              <div className="grid gap-4 py-4">
                <div className="grid items-center gap-2">
                  <Label htmlFor="duration">Tahmini Süre</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Süre seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid items-center gap-2">
                  <Label htmlFor="note">Not (İsteğe Bağlı)</Label>
                  <Textarea 
                    id="note" 
                    placeholder="Örn: Çarşaf yıkıyorum" 
                    value={note} 
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-500">Başlangıç</span>
                    </div>
                    <p className="font-medium">{formatTime(activeMachine.startTime)}</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-500">Bitiş</span>
                    </div>
                    <p className="font-medium">{formatTime(activeMachine.endTime)}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                  <div className="flex items-center mb-2">
                    <Timer className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-500">Kalan Süre</span>
                  </div>
                  <p className="font-medium">{remainingTime} dakika</p>
                </div>
                
                {activeMachine.note && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-500">Not</span>
                    </div>
                    <p className="italic">{activeMachine.note}</p>
                  </div>
                )}
                
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-gray-500">Kullanıcı</span>
                  </div>
                  <p>{activeMachine.user}</p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              {activeMachine.status === 'available' ? (
                <Button type="button" className="w-full" onClick={handleStartMachine}>
                  <Power className="h-4 w-4 mr-2" />
                  Makineyi Başlat
                </Button>
              ) : (
                isOwner && (
                  <Button type="button" variant="destructive" className="w-full" onClick={handleEndMachine}>
                    <Power className="h-4 w-4 mr-2" />
                    İşlemi Sonlandır
                  </Button>
                )
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MachineDialog;
