
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
          <div className="flex items-center justify-center h-full bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center p-8">
              <div className="text-5xl mb-4">🔧</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Em Desenvolvimento</h2>
              <p className="text-gray-500 text-sm">Esta seção estará disponível em breve</p>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30 relative">
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
            className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 p-3 rounded-r-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 z-40 border border-l-0 border-blue-100"
            onClick={() => setSidebarOpen(true)}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
              <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
              <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        )}
        
        <main 
          ref={mainRef}
          className={`flex-1 p-4 md:p-6 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
