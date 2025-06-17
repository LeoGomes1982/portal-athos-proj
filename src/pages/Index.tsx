
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { RHSection } from "@/components/sections/RHSection";
import { Users, Briefcase, DollarSign, Settings, BookOpen, BarChart3, Truck } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState('rh');

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-6">
          {renderSection()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
