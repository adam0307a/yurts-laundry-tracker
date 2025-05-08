
import React from 'react';
import { signInWithGoogle } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { WashingMachine } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import { FaGoogle } from 'react-icons/fa';

const Login: React.FC = () => {
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-primary/5">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <WashingMachine className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">KYK Çamaşırhane Takip</CardTitle>
          <CardDescription>
            Çamaşır ve kurutma makinelerinin durumunu takip etmek için giriş yapın
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Uygulamayı kullanmak için giriş yapmanız gerekmektedir
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleGoogleSignIn} 
            className="w-full flex items-center justify-center gap-2"
          >
            <FaGoogle className="h-4 w-4" />
            Google ile Giriş Yap
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
