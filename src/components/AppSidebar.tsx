
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
    gradient: "from-blue-500 to-blue-600",
    lightBg: "bg-blue-50",
    darkText: "text-blue-700"
  },
  {
    id: "dp",
    title: "Departamento Pessoal",
    icon: "📊",
    shortTitle: "DP",
    gradient: "from-emerald-500 to-emerald-600",
    lightBg: "bg-emerald-50",
    darkText: "text-emerald-700"
  },
  {
    id: "operacoes",
    title: "Operações",
    icon: "⚙️",
    shortTitle: "Operações",
    gradient: "from-orange-500 to-orange-600",
    lightBg: "bg-orange-50",
    darkText: "text-orange-700"
  },
  {
    id: "comercial",
    title: "Comercial",
    icon: "📈",
    shortTitle: "Comercial",
    gradient: "from-purple-500 to-purple-600",
    lightBg: "bg-purple-50",
    darkText: "text-purple-700"
  },
  {
    id: "financeiro",
    title: "Financeiro",
    icon: "💰",
    shortTitle: "Financeiro",
    gradient: "from-teal-500 to-teal-600",
    lightBg: "bg-teal-50",
    darkText: "text-teal-700"
  }
];

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  return (
    <Sidebar className="border-none h-full">
      <SidebarHeader className="p-6 border-b border-gray-100/50">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-white font-bold text-lg">⚡</span>
          </div>
          <h1 className="font-bold text-lg text-gray-800">Sistema</h1>
          <p className="text-xs text-gray-500 font-medium">Gestão Inteligente</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">
            Módulos
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {sections.map((section) => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full p-4 rounded-xl transition-all duration-300 border-2 ${
                      activeSection === section.id
                        ? `bg-gradient-to-r ${section.gradient} text-white shadow-lg border-transparent transform scale-105`
                        : `bg-white hover:${section.lightBg} ${section.darkText} border-gray-100 hover:border-gray-200 hover:shadow-md hover:scale-102`
                    }`}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className={`text-2xl p-2 rounded-xl ${
                        activeSection === section.id 
                          ? 'bg-white/20' 
                          : section.lightBg
                      }`}>
                        {section.icon}
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold text-sm">{section.shortTitle}</span>
                        <span className={`text-xs opacity-80 ${
                          activeSection === section.id ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {section.title}
                        </span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Status indicator */}
        <div className="mt-auto p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <div className="flex items-center gap-2 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">Sistema Online</span>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
