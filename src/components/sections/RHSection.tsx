
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Briefcase, 
  Target,
  UserCheck,
  X
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

export function RHSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="content-wrapper animate-fade-in">
        <div className="section-title-header">
          <div className="section-icon-header bg-blue-600">
            <Users size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">RH</h1>
            <p className="text-slate-600">Recursos Humanos</p>
          </div>
        </div>

        <div className="subsections-grid">
          {subsections.map((subsection) => (
            <div 
              key={subsection.id}
              className="subsection-card"
              onClick={() => setShowModal(true)}
            >
              <div className={`subsection-icon ${subsection.bgColor}`}>
                <subsection.icon size={24} className={subsection.textColor} />
              </div>
              <h3 className="subsection-title">{subsection.title}</h3>
              <p className="subsection-description">{subsection.description}</p>
            </div>
          ))}
        </div>
      </div>

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
                    <h2 className="modal-title">RH</h2>
                    <p className="text-slate-600">Recursos Humanos</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="subsections-grid">
                {subsections.map((subsection) => (
                  <div key={subsection.id} className="subsection-card">
                    <div className={`subsection-icon ${subsection.bgColor}`}>
                      <subsection.icon size={20} className={subsection.textColor} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-2">
                      {subsection.title}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {subsection.description}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <Button onClick={() => setShowModal(false)} className="btn-primary">
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
