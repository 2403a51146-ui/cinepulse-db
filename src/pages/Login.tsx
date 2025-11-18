import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import Parallax3DBackground from "@/components/Parallax3DBackground";

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
      <Parallax3DBackground />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border-2 border-[#FFD700]/20 rounded-full z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-[#8B0000]/20 rounded-full z-10 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-10 w-24 h-24 border border-[#FFD700]/10 rotate-45 z-10" />
      <div className="absolute top-1/3 right-16 w-28 h-28 border border-[#8B0000]/10 rotate-12 z-10" />
      
      <Card className="w-full max-w-md mx-4 border-[#FFD700]/40 shadow-[0_20px_60px_0_rgba(255,215,0,0.3),0_0_0_1px_rgba(255,215,0,0.15)_inset,0_0_80px_rgba(139,0,0,0.2)] relative z-20 bg-background/20 backdrop-blur-3xl overflow-hidden transform transition-all duration-300 hover:shadow-[0_25px_80px_0_rgba(255,215,0,0.4),0_0_0_1px_rgba(255,215,0,0.2)_inset,0_0_100px_rgba(139,0,0,0.3)]">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/8 via-transparent to-[#8B0000]/8 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#8B0000]/50 to-transparent" />
        
        <CardHeader className="space-y-3 relative z-10 pb-6">
          <div className="relative">
            <CardTitle className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#8B0000] to-[#FFD700] drop-shadow-[0_0_30px_rgba(255,215,0,0.5)] tracking-wider animate-pulse">
              CINEPULSE
            </CardTitle>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent rounded-full" />
          </div>
          <CardDescription className="text-center text-muted-foreground/90 text-sm pt-2">
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
