
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
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface DurationFormValues {
  hours: string;
  minutes: string;
  note: string;
}

const MachineDialog: React.FC = () => {
  const { 
    activeMachine, 
    setActiveMachine, 
    startMachine, 
    endMachine,
    calculateRemainingTime,
    username
  } = useAppContext();
  
  const form = useForm<DurationFormValues>({
    defaultValues: {
      hours: '0',
      minutes: '45',
      note: '',
    },
  });
  
  const isOwner = activeMachine?.user === username;
  const remainingTime = activeMachine ? calculateRemainingTime(activeMachine) : 0;
  
  useEffect(() => {
    if (activeMachine) {
      if (activeMachine.duration) {
        const hours = Math.floor(activeMachine.duration / 60).toString();
        const minutes = (activeMachine.duration % 60).toString();
        form.setValue('hours', hours);
        form.setValue('minutes', minutes);
      } else {
        form.setValue('hours', '0');
        form.setValue('minutes', '45');
      }
      form.setValue('note', activeMachine.note || '');
    }
  }, [activeMachine, form]);
  
  const handleStartMachine = (data: DurationFormValues) => {
    if (activeMachine) {
      const hours = parseInt(data.hours) || 0;
      const minutes = parseInt(data.minutes) || 0;
      startMachine(activeMachine, hours, minutes, data.note);
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

  const getMachineTypeLabel = () => {
    if (!activeMachine) return '';
    return activeMachine.type === 'washer' ? 'Çamaşır Makinesi' : 'Kurutma Makinesi';
  };
  
  return (
    <Dialog open={!!activeMachine} onOpenChange={(open) => !open && setActiveMachine(undefined)}>
      <DialogContent className="sm:max-w-[425px]">
        {activeMachine && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <WashingMachine className="h-6 w-6 text-primary" />
                <DialogTitle>{activeMachine.name} {getMachineTypeLabel()}</DialogTitle>
              </div>
              <DialogDescription>
                {activeMachine.status === 'available' 
                  ? 'Bu makineyi kullanmak için detayları girin'
                  : `Durum: ${activeMachine.status === 'finishing' ? 'Bitmek Üzere' : 'Kullanımda'}`
                }
              </DialogDescription>
            </DialogHeader>
            
            {activeMachine.status === 'available' ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleStartMachine)} className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Tahmini Süre</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="hours" className="text-sm">Saat</Label>
                          <Input
                            id="hours"
                            type="number"
                            min="0"
                            max="10"
                            {...form.register('hours')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="minutes" className="text-sm">Dakika</Label>
                          <Input
                            id="minutes"
                            type="number"
                            min="0"
                            max="59"
                            {...form.register('minutes')}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid items-center gap-2">
                      <Label htmlFor="note">Not (İsteğe Bağlı)</Label>
                      <Textarea 
                        id="note"
                        placeholder="Örn: Çarşaf yıkıyorum" 
                        {...form.register('note')}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" className="w-full">
                      <Power className="h-4 w-4 mr-2" />
                      Makineyi Başlat
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
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
            
            {activeMachine.status !== 'available' && isOwner && (
              <DialogFooter>
                <Button type="button" variant="destructive" className="w-full" onClick={handleEndMachine}>
                  <Power className="h-4 w-4 mr-2" />
                  İşlemi Sonlandır
                </Button>
              </DialogFooter>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MachineDialog;
