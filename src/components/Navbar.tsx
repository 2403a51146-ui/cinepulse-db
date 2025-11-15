import { Film, Search, User, TrendingUp, LogOut, BarChart3, Heart } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-hero">
              <Film className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CinePulse
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search movies..."
                className="pl-10 bg-muted/50 border-border"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/analytics">
              <Button 
                variant={isActive("/analytics") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </Button>
            </Link>

            {user && (
              <Link to="/favorites">
                <Button 
                  variant={isActive("/favorites") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Favorites</span>
                </Button>
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin">
                <Button 
                  variant={isActive("/admin") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            )}
            
            {user ? (
              <Button 
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <Link to="/login">
                <Button 
                  variant={isActive("/login") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
