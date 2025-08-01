import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FiscalizacoesSubsectionProps {
  onBack: () => void;
}

export function FiscalizacoesSubsection({ onBack }: FiscalizacoesSubsectionProps) {
  const navigate = useNavigate();

  const opcoesFiscalizacao = [
    {
      id: "posto-servico",
      title: "Fiscalização de Posto de Serviço",
      description: "Realizar fiscalização diretamente nesta tela",
      icon: MapPin,
      iconColor: "text-purple-600",
      cardClass: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-150",
      onClick: () => navigate('/operacoes/fiscalizacoes', { state: { tipo: 'posto_servico' } })
    },
    {
      id: "colaborador",
      title: "Fiscalização de Colaborador",
      description: "Gerar link para compartilhar via WhatsApp",
      icon: User,
      iconColor: "text-blue-600",
      cardClass: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150",
      onClick: () => navigate('/operacoes/fiscalizacoes', { state: { tipo: 'colaborador' } })
    }
  ];

  return (
    <div className="app-container">
      <div className="content-wrapper animate-fade-in">
        {/* Navigation Button */}
        <div className="navigation-button">
          <button onClick={onBack} className="back-button">
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>

        {/* Page Header */}
        <div className="page-header-centered">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Shield className="text-white text-3xl" size={40} />
          </div>
          <div>
            <h1 className="page-title mb-0">Fiscalizações</h1>
            <p className="text-description">Escolha o tipo de fiscalização</p>
          </div>
        </div>

        {/* Options Grid */}
        <div className="content-grid animate-slide-up">
          {opcoesFiscalizacao.map((opcao) => (
            <div 
              key={opcao.id}
              className={`modern-card group relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${opcao.cardClass}`}
              onClick={opcao.onClick}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <opcao.icon size={32} className={opcao.iconColor} />
                </div>
                <div>
                  <h3 className="subsection-title">{opcao.title}</h3>
                  <p className="text-description leading-relaxed">{opcao.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}