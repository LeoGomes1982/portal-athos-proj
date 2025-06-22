
import { useState, useEffect, useRef } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { RHSection } from "@/components/sections/RHSection";
import { Button } from "@/components/ui/button";
import { Home, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeSection, setActiveSection] = useState('rh');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientX <= 15 && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sidebarOpen]);

  const renderSection = () => {
    switch (activeSection) {
      case 'rh':
        return <RHSection />;
      default:
        return (
          <div className="system-page">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center p-8 lg:p-12 glass-card max-w-md mx-4">
                <div className="text-6xl mb-6 animate-bounce">🚀</div>
                <h2 className="system-title mb-4">Em Desenvolvimento</h2>
                <p className="system-subtitle">Esta seção está sendo preparada com muito cuidado para você!</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen flex w-full relative system-background">
        {/* Header moderno */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu size={20} />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GM</span>
                </div>
                <h1 className="font-bold text-lg text-slate-800">Sistema Integrado</h1>
              </div>
            </div>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
              className="glass-button"
            >
              <Home size={16} className="mr-2" />
              Home
            </Button>
          </div>
        </div>

        {/* Sidebar flutuante */}
        <div 
          ref={sidebarRef}
          className={`fixed left-4 top-20 bottom-4 z-50 transition-all duration-300 ease-out w-64 ${
            sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}
        >
          <div className="h-full glass-card">
            <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>
        </div>
        
        {/* Trigger da sidebar quando escondida */}
        {!sidebarOpen && (
          <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
            <div 
              className="glass-button p-2 rounded-r-xl cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
            </div>
          </div>
        )}
        
        {/* Área de conteúdo principal */}
        <main className={`flex-1 transition-all duration-300 pt-16 ${
          sidebarOpen ? 'lg:pl-72' : 'pl-0'
        }`}>
          {renderSection()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
