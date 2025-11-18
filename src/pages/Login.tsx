import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import Cinema3DBackground from "@/components/Cinema3DBackground";

const Login = () => {
  const { signIn, signUp, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, name);
    if (error) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "You can now sign in.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <Cinema3DBackground />
      
      {/* Floating glassmorphism orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl animate-pulse z-10" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#8B0000]/10 rounded-full blur-3xl animate-pulse z-10" style={{ animationDelay: '1s' }} />
      
      <Card className="w-full max-w-md mx-4 border-[#FFD700]/30 shadow-[0_8px_32px_0_rgba(255,215,0,0.25),0_0_0_1px_rgba(255,215,0,0.1)_inset] relative z-20 bg-background/30 backdrop-blur-2xl overflow-hidden">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#8B0000]/5 pointer-events-none" />
        
        <CardHeader className="space-y-1 relative z-10">
          <CardTitle className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#8B0000] to-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">
            CINEPULSE
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground/90">
            Sign in or create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-background/40 backdrop-blur-sm border border-[#FFD700]/10">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-[#FFD700]/20 bg-background/30 backdrop-blur-sm focus:border-[#FFD700]/50 focus:ring-[#FFD700]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-[#FFD700]/20 bg-background/30 backdrop-blur-sm focus:border-[#FFD700]/50 focus:ring-[#FFD700]/20"
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-[#FFD700]/20 bg-background/30 backdrop-blur-sm focus:border-[#FFD700]/50 focus:ring-[#FFD700]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-[#FFD700]/20 bg-background/30 backdrop-blur-sm focus:border-[#FFD700]/50 focus:ring-[#FFD700]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="border-[#FFD700]/20 bg-background/30 backdrop-blur-sm focus:border-[#FFD700]/50 focus:ring-[#FFD700]/20"
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
