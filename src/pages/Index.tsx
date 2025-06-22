
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { RHSection } from "@/components/sections/RHSection";
import { useState } from "react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("rh");

  const renderSection = () => {
    switch (activeSection) {
      case "rh":
        return <RHSection />;
      default:
        return <RHSection />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-6 bg-gray-50">
          {renderSection()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
