
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { WashingMachine } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAppContext();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length > 0) {
      login(username.trim());
    } else {
      setError('Lütfen bir kullanıcı adı girin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-primary/5">
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
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="username"
                  placeholder="Kullanıcı adınız"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Giriş Yap
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
