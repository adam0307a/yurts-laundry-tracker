
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { WashingMachine } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login: React.FC = () => {
  const { login, register } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<string>('login');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (username.trim().length === 0) {
      setError('Lütfen bir kullanıcı adı girin');
      return;
    }
    
    if (password.length === 0) {
      setError('Lütfen şifrenizi girin');
      return;
    }
    
    login(username.trim(), password);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (username.trim().length === 0) {
      setError('Lütfen bir kullanıcı adı girin');
      return;
    }
    
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    
    const success = register(username.trim(), password);
    if (success) {
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setActiveTab('login');
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="login">Giriş Yap</TabsTrigger>
              <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
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
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Şifreniz"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Giriş Yap
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="new-username"
                      placeholder="Kullanıcı adı belirleyin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Şifre belirleyin"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Şifrenizi tekrar girin"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Kayıt Ol
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
