
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
} from "@/components/ui/sidebar";

const sections = [
  {
    id: "rh",
    title: "Recursos Humanos",
    icon: "👥",
    shortTitle: "RH",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-50",
    textColor: "text-blue-600",
    activeColor: "bg-blue-500"
  },
  {
    id: "dp",
    title: "Departamento Pessoal",
    icon: "📊",
    shortTitle: "DP",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-50",
    textColor: "text-green-600",
    activeColor: "bg-green-500"
  },
  {
    id: "operacoes",
    title: "Operações",
    icon: "⚙️",
    shortTitle: "Operações",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-50",
    textColor: "text-orange-600",
    activeColor: "bg-orange-500"
  },
  {
    id: "comercial",
    title: "Comercial",
    icon: "📈",
    shortTitle: "Comercial",
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-50",
    textColor: "text-purple-600",
    activeColor: "bg-purple-500"
  },
  {
    id: "financeiro",
    title: "Financeiro",
    icon: "💰",
    shortTitle: "Financeiro",
    color: "bg-emerald-500",
    hoverColor: "hover:bg-emerald-50",
    textColor: "text-emerald-600",
    activeColor: "bg-emerald-500"
  }
];

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  return (
    <Sidebar className="border-r-0 shadow-xl bg-white">
      <SidebarHeader className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <div>
            <h1 className="font-bold text-base text-gray-800">Sistema</h1>
            <p className="text-xs text-gray-500">Gestão Empresarial</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">
            Módulos
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {sections.map((section) => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full p-3 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? `${section.activeColor} text-white shadow-md`
                        : `bg-white ${section.hoverColor} ${section.textColor} border border-gray-100 hover:border-gray-200 hover:shadow-sm`
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-lg">{section.icon}</span>
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-sm">{section.shortTitle}</span>
                        {activeSection !== section.id && (
                          <span className="text-xs opacity-70">{section.title}</span>
                        )}
                      </div>
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
