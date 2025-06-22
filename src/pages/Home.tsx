
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  Settings, 
  TrendingUp, 
  DollarSign,
  ArrowRight,
  Building2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const sections = [
    {
      id: "rh",
      title: "RH",
      fullTitle: "Recursos Humanos",
      icon: Users,
      className: "portal-card-rh",
      route: "/sistema"
    },
    {
      id: "dp",
      title: "DP",
      fullTitle: "Departamento Pessoal",
      icon: FileText,
      className: "portal-card-dp",
      route: "/sistema"
    },
    {
      id: "operacoes",
      title: "OPERAÇÕES",
      fullTitle: "Gestão Operacional",
      icon: Settings,
      className: "portal-card-operacoes",
      route: "/sistema"
    },
    {
      id: "comercial",
      title: "COMERCIAL",
      fullTitle: "Área Comercial",
      icon: TrendingUp,
      className: "portal-card-comercial",
      route: "/sistema"
    },
    {
      id: "financeiro",
      title: "FINANCEIRO",
      fullTitle: "Gestão Financeira",
      icon: DollarSign,
      className: "portal-card-financeiro",
      route: "/sistema"
    }
  ];

  return (
    <div className="portal-container">
      <div className="portal-wrapper">
        <div className="portal-header animate-fade-in">
          <div className="portal-logo">
            GA
          </div>
          <h1 className="portal-title">Portal Grupo Athos</h1>
          <p className="portal-subtitle">
            Sistema de gestão integrado para organização e controle dos setores essenciais da empresa
          </p>
        </div>

        <div className="section-title-header animate-slide-up">
          <div className="section-icon-header">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Gestão Interna</h2>
          </div>
        </div>

        <div className="portal-grid animate-slide-up">
          {sections.map((section) => (
            <div 
              key={section.id}
              className={`portal-card ${section.className}`}
              onClick={() => navigate(section.route)}
            >
              <section.icon className="portal-card-icon" size={48} />
              <div className="portal-card-content">
                <h3 className="portal-card-title">{section.title}</h3>
                <p className="portal-card-description">{section.fullTitle}</p>
                <div className="portal-card-action">
                  <span>Acessar</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center animate-fade-in">
          <p className="text-sm text-slate-500">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
