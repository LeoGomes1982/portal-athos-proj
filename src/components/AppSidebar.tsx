
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
    title: "Recursos Humanos",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    id: "dp",
    title: "Departamento Pessoal",
    icon: FileText,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  {
    id: "operacoes",
    title: "Operações",
    icon: Settings,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    id: "comercial",
    title: "Comercial",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    id: "financeiro",
    title: "Financeiro",
    icon: DollarSign,
    color: "text-teal-600",
    bgColor: "bg-teal-50"
  }
];

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  return (
    <Sidebar className="border-none h-full bg-transparent">
      <SidebarHeader className="p-4 border-b border-slate-200/50">
        <div className="text-center">
          <h2 className="font-bold text-lg text-slate-800 mb-1">Módulos</h2>
          <p className="text-sm text-slate-500">Selecione um setor</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {sections.map((section) => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 text-left ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-102'
                        : 'bg-white/60 hover:bg-white/80 text-slate-700 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activeSection === section.id 
                          ? 'bg-white/20 text-white' 
                          : `${section.bgColor} ${section.color}`
                      }`}>
                        <section.icon size={20} />
                      </div>
                      <div>
                        <span className="font-semibold text-sm">{section.title}</span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Status indicator */}
        <div className="mt-auto p-4 bg-green-50/80 rounded-2xl border border-green-200/50">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Sistema Online</span>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
