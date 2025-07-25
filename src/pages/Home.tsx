import { useEffect, useState } from "react";
import { 
  Users, 
  FileText, 
  Settings, 
  TrendingUp, 
  DollarSign,
  Building2,
  Globe,
  UserPlus,
  Calendar,
  Briefcase,
  Target,
  Book,
  Shield,
  Bell,
  LogOut,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { NotificationBadge } from "@/components/NotificationBadge";
import { useDocumentNotifications } from "@/hooks/useDocumentNotifications";
import { useAvisoVencimentos } from "@/hooks/useAvisoVencimentos";
import { useAgendaAlerts } from "@/hooks/useAgendaAlerts";
import { useCICADAlerts } from "@/hooks/useCICADAlerts";
import { UrgentTasksModal } from "@/components/modals/UrgentTasksModal";

import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  
  const { toast } = useToast();
  const { hasNotifications, checkDocumentosVencendo } = useDocumentNotifications();
  const { hasAvisos } = useAvisoVencimentos();
  const { hasUrgentTasks, urgentTasks } = useAgendaAlerts();
  const { hasNewDenuncias, markAsChecked } = useCICADAlerts();
  const [showUrgentTasksModal, setShowUrgentTasksModal] = useState(false);
  const [showUserTooltip, setShowUserTooltip] = useState(false);
  const [hasAgendaNotification, setHasAgendaNotification] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Verificar se há compromissos para notificar
  useEffect(() => {
    const checkAgendaNotifications = async () => {
      try {
        const hoje = new Date();
        const hojeStr = hoje.toISOString().split('T')[0];
        
        const { data: compromissos } = await supabase
          .from('compromissos')
          .select('*')
          .eq('data', hojeStr)
          .eq('concluido', false);

        setHasAgendaNotification(compromissos && compromissos.length > 0);
      } catch (error) {
        console.error('Erro ao verificar compromissos:', error);
      }
    };

    checkAgendaNotifications();
    // Verificar a cada minuto
    const interval = setInterval(checkAgendaNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Verificar notificações quando o componente monta
  useEffect(() => {
    const savedDocs = localStorage.getItem('documentos');
    if (savedDocs) {
      checkDocumentosVencendo(JSON.parse(savedDocs));
    }
  }, [checkDocumentosVencendo]);

  const gestaoInternaSection = [
    {
      id: "dp",
      title: "DP e RH",
      fullTitle: "Departamento Pessoal e Recursos Humanos",
      icon: FileText,
      className: "bg-secondary border-primary/20 hover:border-primary/30",
      iconColor: "text-primary",
      onClick: () => navigate("/dp"),
      hasNotification: true,
      hasAvisos: true
    },
    {
      id: "agenda",
      title: "AGENDA",
      fullTitle: "Gestão de Tarefas e Agendamentos",
      icon: Calendar,
      className: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:from-indigo-100 hover:to-indigo-150",
      iconColor: "text-indigo-600",
      onClick: () => navigate("/agenda"),
      hasUrgentTasks: true,
      hasAgendaNotification: true
    },
    {
      id: "gerencia",
      title: "GERÊNCIA",
      fullTitle: "Gestão Estratégica e Operacional",
      icon: Briefcase,
      className: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-150",
      iconColor: "text-purple-600",
      onClick: () => navigate("/gerencia")
    },
    {
      id: "cicad",
      title: "CICAD",
      fullTitle: "Canal Interno de Comunicação Anônima Direta",
      icon: Shield,
      className: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-150",
      iconColor: "text-green-600",
      onClick: () => {
        markAsChecked();
        navigate("/cicad");
      },
      hasNewDenuncias: true
    },
    {
      id: "manuais",
      title: "MANUAIS",
      fullTitle: "Manuais e Documentos Normativos",
      icon: Book,
      className: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150",
      iconColor: "text-blue-600",
      onClick: () => navigate("/manuais")
    },
    {
      id: "operacoes",
      title: "OPERAÇÕES",
      fullTitle: "Gestão Operacional",
      icon: Settings,
      className: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-150",
      iconColor: "text-gray-600"
    },
    {
      id: "comercial",
      title: "COMERCIAL",
      fullTitle: "Área Comercial",
      icon: TrendingUp,
      className: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-150",
      iconColor: "text-orange-600",
      onClick: () => navigate("/comercial")
    },
    {
      id: "financeiro",
      title: "FINANCEIRO",
      fullTitle: "Gestão Financeira",
      icon: DollarSign,
      className: "bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-150",
      iconColor: "text-red-600"
    },
    {
      id: "configuracoes",
      title: "CONFIGURAÇÕES",
      fullTitle: "Configurações do Sistema",
      icon: Settings,
      className: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:from-slate-100 hover:to-slate-150",
      iconColor: "text-slate-600",
      onClick: () => navigate("/configuracoes")
    }
  ];

  const portaisExternosSection = [
    {
      id: "portal-admissao",
      title: "PORTAL DE ADMISSÃO",
      fullTitle: "Portal de Admissão de Funcionários",
      icon: UserPlus,
      className: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-150",
      iconColor: "text-emerald-600",
      onClick: () => {
        const url = `${window.location.origin}/portal-admissao`;
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    {
      id: "portal-vagas",
      title: "PORTAL DE VAGAS",
      fullTitle: "Portal de Vagas e Oportunidades",
      icon: Target,
      className: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-150",
      iconColor: "text-emerald-600",
      onClick: () => {
        const url = `${window.location.origin}/portal-vagas`;
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    {
      id: "portal-midia",
      title: "PORTAL DE MÍDIA EXTERNA",
      fullTitle: "Gerenciamento de Conteúdo Multimídia",
      icon: Globe,
      className: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150",
      iconColor: "text-blue-600",
      onClick: () => navigate("/portal-midia-externa")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header com informações do usuário e logout */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-slate-600" />
              <span className="text-slate-800 font-medium">
                Bem-vindo, {profile?.nome || user?.email}
              </span>
              {profile?.role && (
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                  {profile.role === 'admin' ? 'Administrador' : 
                   profile.role === 'manager' ? 'Gerente' : 'Funcionário'}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 h-10 w-10 hover:bg-slate-100"
                  onClick={() => setShowNotificationModal(true)}
                >
                  <Bell size={18} className="text-slate-600" />
                  {(hasNotifications || hasAvisos || hasUrgentTasks || hasNewDenuncias || hasAgendaNotification) && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </Button>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="p-2 h-10 w-10 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Sair do sistema"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-white font-bold text-2xl">GA</span>
          </div>
          <h1 className="page-title text-center">
            Portal Grupo Athos
          </h1>
          <p className="text-description text-center max-w-2xl mx-auto text-base">
            Sistema de gestão integrado para organização e controle dos setores essenciais da empresa
          </p>
        </div>

        {/* Section Title - Gestão Interna */}
        <div className="page-header justify-center animate-slide-up">
          <div className="page-header-icon bg-gradient-to-br from-slate-100 to-slate-200">
            <Building2 size={24} className="text-slate-600" />
          </div>
          <div>
            <h2 className="section-title mb-0">Portal de Gestão</h2>
            <p className="text-description">Módulos internos do sistema</p>
          </div>
        </div>

        {/* Cards Grid - Gestão Interna */}
        <div className="content-grid animate-slide-up mb-12">
          {gestaoInternaSection.map((section) => (
            <div 
              key={section.id}
              className={`modern-card group relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${section.className}`}
              onClick={(e) => {
                if (section.hasUrgentTasks && hasUrgentTasks && section.id === "agenda") {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickY = e.clientY - rect.top;
                  
                  if (clickY < rect.height / 2) {
                    e.preventDefault();
                    setShowUserTooltip(!showUserTooltip);
                    return;
                  }
                }
                
                if (section.onClick) {
                  section.onClick();
                }
              }}
            >
              {/* Notificação para DP e RH */}
              {section.hasNotification && (
                <NotificationBadge show={hasNotifications} />
              )}
              
              {/* Aviso de compromissos para Agenda */}
              {section.hasAgendaNotification && hasAgendaNotification && section.id === "agenda" && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-pulse border-2 border-white flex items-center justify-center z-10">
                  <Calendar size={12} className="text-white" />
                </div>
              )}
              
              {/* Aviso de tarefas urgentes para Agenda */}
              {section.hasUrgentTasks && hasUrgentTasks && (
                <>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse border-2 border-white flex items-center justify-center z-10">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  
                  {/* Tooltip com nome do usuário */}
                  {showUserTooltip && (
                    <div className="absolute -top-12 -right-8 bg-white border-2 border-red-200 rounded-lg shadow-lg px-3 py-2 z-20 min-w-max">
                      <div className="text-xs text-red-600 font-medium">
                        {urgentTasks.length > 0 && urgentTasks[0].criadoPor}
                      </div>
                      <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-200"></div>
                    </div>
                  )}
                </>
              )}
              
              {/* Aviso de novas denúncias para CICAD */}
              {section.hasNewDenuncias && hasNewDenuncias && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse border-2 border-white flex items-center justify-center z-10">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              )}
              
              {/* Aviso de documentos vencendo para DP e RH */}
              {section.hasAvisos && hasAvisos && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse border-2 border-white flex items-center justify-center z-10">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              )}
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <section.icon size={32} className={section.iconColor} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {section.fullTitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Title - Portais Externos */}
        <div className="page-header justify-center animate-slide-up">
          <div className="page-header-icon bg-gradient-to-br from-emerald-100 to-emerald-200">
            <Globe size={24} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="section-title mb-0">Portais Externos</h2>
            <p className="text-description">Acesso público e interfaces externas</p>
          </div>
        </div>

        {/* Cards Grid - Portais Externos */}
        <div className="content-grid animate-slide-up">
          {portaisExternosSection.map((section) => (
            <div 
              key={section.id}
              className={`modern-card group relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${section.className}`}
              onClick={section.onClick}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <section.icon size={32} className={section.iconColor} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {section.fullTitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Tarefas Urgentes */}
      <UrgentTasksModal 
        open={showUrgentTasksModal}
        onOpenChange={setShowUrgentTasksModal}
        compromissosUrgentes={urgentTasks}
      />

      {/* Componente de Notificação */}
      <div className="fixed bottom-4 right-4">
        <NotificationBadge show={hasNotifications || hasAvisos || hasUrgentTasks || hasNewDenuncias || hasAgendaNotification} />
      </div>
    </div>
  );
};

export default Home;