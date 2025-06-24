
import { UserPlus } from "lucide-react";

export const PortalHeader = () => {
  return (
    <div className="text-center mb-16 animate-fade-in">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
        <UserPlus size={40} className="text-white" />
      </div>
      <h1 className="text-5xl font-bold text-slate-800 mb-4 leading-tight">
        Portal de Admissão
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
        Bem-vindo ao nosso processo de admissão online. Siga os passos abaixo para completar sua jornada conosco.
      </p>
    </div>
  );
};
