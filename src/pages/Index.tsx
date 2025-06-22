import { useState, useEffect, useRef } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { RHSection } from "@/components/sections/RHSection";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
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
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-30"></div>
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full opacity-20"></div>
            </div>
            
            <div className="flex items-center justify-center min-h-[60vh] relative z-10">
              <div className="text-center p-12 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg border max-w-md mx-4">
                <div className="text-6xl mb-6 animate-bounce">🚀</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Em Breve</h2>
                <p className="text-gray-600">Estamos preparando esta seção com muito carinho para você!</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen flex w-full relative">
        {/* Header with Home button */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-white shadow-lg"
          >
            <Home size={16} className="mr-2" />
            Home
          </Button>
        </div>

        {/* Floating Sidebar */}
        <div 
          ref={sidebarRef}
          className={`fixed left-2 top-2 bottom-2 z-50 transition-all duration-500 ease-out w-64 lg:w-72 ${
            sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}
        >
          <div className="h-full backdrop-blur-lg bg-white/95 rounded-2xl shadow-2xl border border-white/20">
            <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>
        </div>
        
        {/* Sidebar trigger when hidden */}
        {!sidebarOpen && (
          <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
            <div 
              className="bg-white/90 backdrop-blur-sm p-3 rounded-r-2xl shadow-lg cursor-pointer hover:bg-white transition-all duration-300 border-r border-t border-b border-gray-200"
              onClick={() => setSidebarOpen(true)}
            >
              <div className="flex flex-col gap-1">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main content area */}
        <main className={`flex-1 transition-all duration-500 ease-out ${
          sidebarOpen ? 'ml-0 lg:ml-0' : 'ml-0'
        }`}>
          <div className={`transition-all duration-500 ${sidebarOpen ? 'pl-4 pr-4 lg:pl-80' : 'px-4'}`}>
            {renderSection()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
