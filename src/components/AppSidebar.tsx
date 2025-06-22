
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
    description: "Gestão de pessoas"
  },
  {
    id: "dp",
    title: "Depto. Pessoal",
    icon: FileText,
    description: "Folha e benefícios"
  },
  {
    id: "operacoes",
    title: "Operações",
    icon: Settings,
    description: "Processos internos"
  },
  {
    id: "comercial",
    title: "Comercial",
    icon: TrendingUp,
    description: "Vendas e marketing"
  },
  {
    id: "financeiro",
    title: "Financeiro",
    icon: DollarSign,
    description: "Controle financeiro"
  }
];

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  return (
    <Sidebar className="bg-white border-r border-slate-200">
      <SidebarHeader className="p-6 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Módulos</h2>
          <p className="text-sm text-slate-500">Selecione uma área</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {sections.map((section) => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full p-3 rounded-xl transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activeSection === section.id 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <section.icon size={20} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{section.title}</div>
                        <div className="text-xs opacity-70">{section.description}</div>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Sistema Online</span>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
