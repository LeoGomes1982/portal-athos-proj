
import { Button } from "@/components/ui/button";
import { X, User, Phone, Mail, MapPin, FileText, Eye } from "lucide-react";

interface Candidato {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  curriculo: File | null;
  sobreMim: string;
  experiencias: string;
  dataInscricao: string;
}

interface CandidatosModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaga: {
    id: string;
    titulo: string;
    departamento: string;
  };
  candidatos: Candidato[];
}

export function CandidatosModal({ isOpen, onClose, vaga, candidatos }: CandidatosModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <User size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="modal-title">Candidatos</h2>
                <p className="text-description">{vaga.titulo} - {vaga.departamento}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="secondary-btn p-2 h-auto"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        <div className="modal-body">
          {candidatos.length === 0 ? (
            <div className="text-center py-12">
              <User size={48} className="text-slate-400 mx-auto mb-4" />
              <p className="text-description">Nenhum candidato inscrito ainda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidatos.map((candidato) => (
                <div key={candidato.id} className="modern-card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{candidato.nome}</h3>
                      <p className="text-sm text-slate-600">
                        Inscrito em: {new Date(candidato.dataInscricao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Eye size={16} />
                      Ver Detalhes
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={16} />
                        {candidato.telefone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={16} />
                        {candidato.email || "Não informado"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={16} />
                        {candidato.endereco}
                      </div>
                      {candidato.curriculo && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FileText size={16} />
                          Currículo anexado
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {candidato.sobreMim && (
                        <div>
                          <h4 className="font-medium text-slate-800 mb-1">Sobre mim:</h4>
                          <p className="text-sm text-slate-600">{candidato.sobreMim}</p>
                        </div>
                      )}
                      
                      {candidato.experiencias && (
                        <div>
                          <h4 className="font-medium text-slate-800 mb-1">Experiências:</h4>
                          <p className="text-sm text-slate-600">{candidato.experiencias}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
