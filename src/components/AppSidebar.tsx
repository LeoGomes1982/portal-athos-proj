
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
    <Sidebar className="sidebar-modern">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Módulos</h2>
          <p className="text-sm text-gray-500">Selecione uma área</p>
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
                    className={`sidebar-item ${
                      activeSection === section.id
                        ? 'sidebar-item-active bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600'
                        : 'sidebar-item-inactive'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full p-2">
                      <div className={`icon-btn ${
                        activeSection === section.id 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-gray-100 text-gray-600'
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

        {/* Status do Sistema */}
        <div className="mt-auto p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-center gap-2 text-emerald-700">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Sistema Online</span>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
