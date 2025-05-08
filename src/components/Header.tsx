
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { WashingMachine, LogOut } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header: React.FC = () => {
  const { user, logout } = useAppContext();
  
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <WashingMachine className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">KYK Çamaşırhane</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeSwitcher />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={user?.email || "User"} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || user?.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Çıkış Yap</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
