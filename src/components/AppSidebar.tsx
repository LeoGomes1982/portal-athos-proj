
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { 
  Users, 
  FileText, 
  Settings, 
  TrendingUp, 
  DollarSign 
} from "lucide-react";

const sections = [
  {
    id: "rh",
    title: "RH",
    icon: Users,
    color: "text-blue-600"
  },
  {
    id: "dp",
    title: "DP",
    icon: FileText,
    color: "text-emerald-600"
  },
  {
    id: "operacoes",
    title: "Operações",
    icon: Settings,
    color: "text-orange-600"
  },
  {
    id: "comercial",
    title: "Comercial",
    icon: TrendingUp,
    color: "text-purple-600"
  },
  {
    id: "financeiro",
    title: "Financeiro",
    icon: DollarSign,
    color: "text-teal-600"
  }
];

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  return (
    <Sidebar className="border-none h-full bg-white shadow-xl">
      <SidebarHeader className="p-4 border-b border-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            <span className="text-white font-bold text-xl">⚡</span>
          </div>
          <h1 className="font-bold text-lg text-gray-800">Sistema</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {sections.map((section) => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full p-4 rounded-xl transition-all duration-300 border-2 text-left ${
                      activeSection === section.id
                        ? `bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border-transparent transform scale-102`
                        : `bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md`
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <section.icon 
                        size={24} 
                        className={activeSection === section.id ? 'text-white' : section.color}
                      />
                      <span className="font-semibold text-base">{section.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Status indicator */}
        <div className="mt-auto p-3 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Sistema Online</span>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
