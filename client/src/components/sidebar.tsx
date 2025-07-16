import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Box, DraftingCompass, ChartLine, BellRing, BarChart3, User, Menu, X, Home, Shield, Heart } from "lucide-react";
import logoPath from "@assets/C40089C9-F4D0-4D4E-8056-BC35F95B05D3_1752696036206.png";

export default function Sidebar() {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const isActive = (path: string) => {
    if (path === "/" && (location === "/" || location === "/design")) return true;
    if (path === "/room/dungeon" && location === "/room/dungeon") return true;
    if (path === "/scapes" && location === "/scapes") return true;
    return location === path;
  };

  return (
    <>
      {/* Mobile header */}
      <header className="bg-background/95 backdrop-blur-sm tron-border border-b lg:hidden fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <button 
            className="text-muted-foreground hover:text-accent" 
            onClick={toggleMobile}
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-lg font-semibold tron-text">KinqueScape</span>
          <div></div>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background/95 backdrop-blur-sm tron-border border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 tron-border border-b">
          <div className="flex items-center space-x-3">
            <img 
              src={logoPath} 
              alt="KinqueScape Logo" 
              className="w-8 h-8 object-contain logo-glow"
            />
            <span className="text-xl font-bold tron-text">KinqueScape</span>
          </div>
          <button 
            className="lg:hidden text-muted-foreground hover:text-accent" 
            onClick={toggleMobile}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            <Link href="/">
              <div className={`nav-item ${isActive("/") ? "active" : ""}`} onClick={() => setIsMobileOpen(false)}>
                <Home className="w-5 h-5" />
                <span>Home</span>
              </div>
            </Link>
            <Link href="/design">
              <div className={`nav-item ${isActive("/design") ? "active" : ""}`} onClick={() => setIsMobileOpen(false)}>
                <DraftingCompass className="w-5 h-5" />
                <span>Design Studio</span>
              </div>
            </Link>
            <Link href="/plan">
              <div className={`nav-item ${isActive("/plan") ? "active" : ""}`} onClick={() => setIsMobileOpen(false)}>
                <ChartLine className="w-5 h-5" />
                <span>Business Plan</span>
              </div>
            </Link>
            <Link href="/dash">
              <div className={`nav-item ${isActive("/dash") ? "active" : ""}`} onClick={() => setIsMobileOpen(false)}>
                <BarChart3 className="w-5 h-5" />
                <span>Live Dashboard</span>
              </div>
            </Link>
            <Link href="/scapes">
              <div className={`nav-item ${isActive("/scapes") ? "active" : ""}`} onClick={() => setIsMobileOpen(false)}>
                <Heart className="w-5 h-5" />
                <span>Adult 'Scapes</span>
              </div>
            </Link>
            <Link href="/room/dungeon">
              <div className={`nav-item ${isActive("/room/dungeon") ? "active" : ""}`} onClick={() => setIsMobileOpen(false)}>
                <Shield className="w-5 h-5" />
                <span>Dungeon Control</span>
              </div>
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-accent/30">
            <div className="px-3 mb-3">
              <h3 className="text-xs font-semibold text-accent uppercase tracking-wider">Recent 'Scapes</h3>
            </div>
            <div className="space-y-1">
              <a href="#" className="project-item">
                <div className="w-3 h-3 bg-green-400 rounded-full tron-pulse"></div>
                <span>Haunted Mansion 'Scape</span>
              </a>
              <a href="#" className="project-item">
                <div className="w-3 h-3 bg-blue-400 rounded-full tron-pulse"></div>
                <span>Space Station 'Scape</span>
              </a>
              <a href="#" className="project-item">
                <div className="w-3 h-3 bg-purple-400 rounded-full tron-pulse"></div>
                <span>Detective Mystery 'Scape</span>
              </a>
            </div>
          </div>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="bg-accent/10 rounded-lg p-3 tron-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center tron-glow">
                <User className="w-4 h-4 text-background" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Master Controller</p>
                <p className="text-xs text-accent">KinqueScape Demo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={toggleMobile}
        />
      )}

      {/* Spacer for mobile header */}
      <div className="h-16 lg:hidden"></div>
    </>
  );
}
