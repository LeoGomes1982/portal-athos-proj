
import { useState, useEffect, useRef } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { RHSection } from "@/components/sections/RHSection";
import { Button } from "@/components/ui/button";
import { Home, Menu, Bell, Search, User } from "lucide-react";
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  const renderSection = () => {
    switch (activeSection) {
      case 'rh':
        return <RHSection />;
      default:
        return (
          <div className="app-container">
            <div className="content-wrapper">
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="modern-card p-12 text-center max-w-md">
                  <div className="text-6xl mb-6">🚧</div>
                  <h2 className="page-title mb-4">Em Desenvolvimento</h2>
                  <p className="text-gray-600">Esta seção será disponibilizada em breve!</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen flex w-full app-container">
        {/* Header Moderno */}
        <div className="fixed top-0 left-0 right-0 z-40 modern-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu size={20} />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Sistema Integrado</h1>
                  <p className="text-sm text-gray-500">Gestão Empresarial</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex"
              >
                <Search size={16} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex"
              >
                <Bell size={16} />
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Home size={16} />
                <span className="hidden md:inline">Início</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div 
          ref={sidebarRef}
          className={`fixed left-0 top-16 bottom-0 z-30 w-64 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:relative lg:translate-x-0 lg:top-0`}
        >
          <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>
        
        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Conteúdo Principal */}
        <main className={`flex-1 pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
          {renderSection()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
