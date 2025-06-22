
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  Users, 
  FileText, 
  Settings, 
  TrendingUp, 
  DollarSign,
  Building2,
  Home
} from "lucide-react";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  {
    id: "home",
    title: "Início",
    icon: Home,
  },
  {
    id: "rh",
    title: "RH",
    icon: Users,
  },
  {
    id: "dp",
    title: "DP",
    icon: FileText,
  },
  {
    id: "operacoes",
    title: "Operações",
    icon: Settings,
  },
  {
    id: "comercial",
    title: "Comercial",
    icon: TrendingUp,
  },
  {
    id: "financeiro",
    title: "Financeiro",
    icon: DollarSign,
  },
];

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Grupo Athos</h1>
            <p className="text-sm text-muted-foreground">Sistema de Gestão</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => setActiveSection(item.id)}
                isActive={activeSection === item.id}
                className="w-full justify-start"
              >
                <item.icon size={20} />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
