
import { useState, useEffect } from "react";
import { AdmissaoModal } from "@/components/modals/AdmissaoModal";

const PortalAdmissao = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Abrir o modal automaticamente quando a página carregar
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Redirecionar ou mostrar uma página de agradecimento
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center">
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
          <span className="text-white font-bold text-2xl">🚀</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Portal de Admissão
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Bem-vindo ao nosso processo de admissão online. Preencha suas informações para iniciar sua jornada conosco.
        </p>
        
        {!isModalOpen && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg"
          >
            ➡️ Iniciar Processo de Admissão
          </button>
        )}
      </div>

      <AdmissaoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PortalAdmissao;
