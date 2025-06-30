
import { ChevronLeft } from "lucide-react";

interface ResultadosPessoaisSubsectionProps {
  onBack: () => void;
}

export function ResultadosPessoaisSubsection({ onBack }: ResultadosPessoaisSubsectionProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="content-wrapper animate-fade-in bg-blue-100/80 rounded-lg shadow-lg m-6 p-8">
        {/* Navigation Button */}
        <div className="navigation-button">
          <button onClick={onBack} className="back-button">
            <ChevronLeft size={16} />
            Voltar
          </button>
        </div>

        {/* Page Header */}
        <div className="page-header-centered">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-white text-3xl">📈</span>
          </div>
          <div>
            <h1 className="page-title mb-0">Resultados Pessoais</h1>
            <p className="text-description">Acompanhamento de performance e metas individuais</p>
          </div>
        </div>

        <div className="text-center py-16">
          <p className="text-lg text-slate-600">Em desenvolvimento...</p>
        </div>
      </div>
    </div>
  );
}
