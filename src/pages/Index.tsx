
import { useState, useEffect, useRef } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { RHSection } from "@/components/sections/RHSection";

const Index = () => {
  const [activeSection, setActiveSection] = useState('rh');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Auto-hide sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      // Show sidebar when mouse is near the left edge
      if (event.clientX <= 20 && !sidebarOpen) {
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
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-gray-600 mb-2">Em Desenvolvimento</h2>
              <p className="text-gray-500">Esta seção será implementada em breve</p>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen flex w-full bg-gray-50 relative">
        <div 
          ref={sidebarRef}
          className={`transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed left-0 top-0 z-50 h-full`}
        >
          <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>
        
        {/* Show sidebar indicator when hidden */}
        {!sidebarOpen && (
          <div 
            className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-r-lg shadow-lg cursor-pointer hover:bg-blue-700 transition-colors z-40"
            onClick={() => setSidebarOpen(true)}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        )}
        
        <main 
          ref={mainRef}
          className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          {renderSection()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
