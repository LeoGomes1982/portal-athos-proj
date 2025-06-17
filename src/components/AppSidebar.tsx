
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Users, Briefcase, DollarSign, Settings, BookOpen, BarChart3, Truck } from "lucide-react";

const sections = [
  {
    id: "rh",
    title: "RH",
    icon: "👥",
    color: "bg-blue-500",
    textColor: "text-blue-600"
  },
  {
    id: "dp",
    title: "DP",
    icon: "💼",
    color: "bg-green-500",
    textColor: "text-green-600"
  },
  {
    id: "operacoes",
    title: "Operações",
    icon: "⚙️",
    color: "bg-orange-500",
    textColor: "text-orange-600"
  },
  {
    id: "comercial",
    title: "Comercial",
    icon: "📈",
    color: "bg-purple-500",
    textColor: "text-purple-600"
  },
  {
    id: "financeiro",
    title: "Financeiro",
    icon: "💰",
    color: "bg-emerald-500",
    textColor: "text-emerald-600"
  },
  {
    id: "configuracoes",
    title: "Configurações",
    icon: "⚙️",
    color: "bg-gray-500",
    textColor: "text-gray-600"
  },
  {
    id: "manuais",
    title: "Manuais",
    icon: "📚",
    color: "bg-indigo-500",
    textColor: "text-indigo-600"
  },
  {
    id: "gerencia",
    title: "Gerência",
    icon: "👔",
    color: "bg-red-500",
    textColor: "text-red-600"
  }
];

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            🏢
          </div>
          <div>
            <h1 className="font-bold text-lg">Sistema Interno</h1>
            <p className="text-sm text-gray-500">Controle de Processos</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Setores
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {sections.map((section) => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                      activeSection === section.id
                        ? `${section.color} text-white shadow-lg`
                        : `bg-white hover:bg-gray-50 ${section.textColor} border border-gray-200`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.icon}</span>
                      <span className="font-medium">{section.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
