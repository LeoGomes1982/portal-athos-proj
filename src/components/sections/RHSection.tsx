
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Briefcase, 
  Target,
  UserCheck,
  X,
  ChevronLeft
} from "lucide-react";

const subsections = [
  {
    id: "vagas",
    title: "Vagas",
    description: "Gestão de vagas disponíveis",
    icon: Briefcase,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700"
  },
  {
    id: "banco-talentos",
    title: "Banco de Talentos",
    description: "Candidatos e talentos",
    icon: Target,
    bgColor: "bg-green-100",
    textColor: "text-green-700"
  },
  {
    id: "processo-seletivo",
    title: "Processo Seletivo",
    description: "Gestão de seleções",
    icon: UserCheck,
    bgColor: "bg-purple-100",
    textColor: "text-purple-700"
  }
];

interface RHSectionProps {
  onBack?: () => void;
}

export function RHSection({ onBack }: RHSectionProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="app-container">
      <div className="content-wrapper animate-fade-in">
        {/* Back Button */}
        {onBack && (
          <button onClick={onBack} className="back-button">
            <ChevronLeft size={16} />
            Voltar
          </button>
        )}

        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-icon bg-blue-600">
            <Users size={24} />
          </div>
          <div>
            <h1 className="page-title mb-0">Recursos Humanos</h1>
            <p className="text-description">Gestão de pessoas e talentos</p>
          </div>
        </div>

        {/* Subsections Grid */}
        <div className="content-grid">
          {subsections.map((subsection) => (
            <div 
              key={subsection.id}
              className="modern-card cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={() => setShowModal(true)}
            >
              <div className="card-content text-center">
                <div className={`w-16 h-16 ${subsection.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <subsection.icon size={24} className={subsection.textColor} />
                </div>
                <h3 className="subsection-title">{subsection.title}</h3>
                <p className="text-description">{subsection.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="modal-title">Recursos Humanos</h2>
                    <p className="text-description">Gestão de pessoas e talentos</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="secondary-btn p-2 h-auto"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="content-grid">
                {subsections.map((subsection) => (
                  <div key={subsection.id} className="modern-card">
                    <div className="card-content text-center">
                      <div className={`w-12 h-12 ${subsection.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                        <subsection.icon size={20} className={subsection.textColor} />
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-2 text-sm">
                        {subsection.title}
                      </h3>
                      <p className="text-description text-xs">
                        {subsection.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <button onClick={() => setShowModal(false)} className="secondary-btn">
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
